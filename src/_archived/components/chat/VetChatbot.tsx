import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Send, Loader2, Calendar, PawPrint } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useRateLimit } from "@/hooks/useRateLimit";
import { logSecurityEvent, detectSuspiciousPattern } from "@/lib/security-logger";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import dogtorAvatar from "/dogtor-avatar.png";

// Input validation
const messageSchema = z.string()
  .trim()
  .min(1, "El mensaje no puede estar vacio")
  .max(500, "El mensaje no puede exceder 500 caracteres");

interface Message {
  role: 'user' | 'assistant';
  content: string;
  action?: {
    type: 'book_appointment' | 'add_pet' | 'show_hours' | 'show_contact';
    data?: any;
  };
}

export function VetChatbot() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Safety check: only render for authenticated users
  if (!isAuthenticated) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Ey, bienvenido a VetWonder! Soy el Dogtor, tu asistente peludo favorito. Estoy aqui para echarte una mano con lo que necesites: pedir citas, registrar a tu mascota, consultar horarios... lo que sea. Dispara!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rate limiting: 15 mensajes cada 5 minutos
  const { checkRateLimit, isRateLimited, remainingTime } = useRateLimit({
    maxAttempts: 15,
    windowMs: 5 * 60 * 1000,
    storageKey: 'dogtor_rate_limit',
  });

  // Show popup after 30 seconds
  useEffect(() => {
    if (hasShownPopup || isOpen) return;

    const timer = setTimeout(() => {
      if (!isOpen && !hasShownPopup) {
        setShowPopup(true);
        setHasShownPopup(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isOpen, hasShownPopup]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOpenChat = () => {
    setShowPopup(false);
    setIsOpen(true);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Validate input
    try {
      messageSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    // Check rate limit
    if (!checkRateLimit()) {
      await logSecurityEvent('rate_limit_hit', 'dogtor');
      toast.error(`Tranqui, muchas consultas seguidas. Espera ${remainingTime} segundos o llama al 918 57 43 79.`);
      return;
    }

    // Check for suspicious patterns
    const patternCheck = detectSuspiciousPattern(input);
    if (patternCheck.isSuspicious) {
      await logSecurityEvent('suspicious_pattern', 'dogtor', {
        reason: patternCheck.reason,
      });
      toast.error('Eso no lo puedo procesar, colega.');
      return;
    }

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/public/dogtor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          isAuthenticated,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error('Demasiadas consultas. Llama al 918 57 43 79');
          return;
        }
        if (response.status === 402) {
          toast.error('Servicio no disponible ahora. Llama al 918 57 43 79');
          return;
        }
        throw new Error('Error al procesar tu consulta');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let buffer = '';
      let actionData: Message['action'] | undefined;

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || line.startsWith(':')) continue;
          if (!line.startsWith('data: ')) continue;

          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;

              // Detect action commands
              if (assistantMessage.includes('[ACTION:BOOK_APPOINTMENT]')) {
                actionData = { type: 'book_appointment' };
                assistantMessage = assistantMessage.replace('[ACTION:BOOK_APPOINTMENT]', '');
              }
              if (assistantMessage.includes('[ACTION:ADD_PET]')) {
                actionData = { type: 'add_pet' };
                assistantMessage = assistantMessage.replace('[ACTION:ADD_PET]', '');
              }

              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  ...newMessages[newMessages.length - 1],
                  content: assistantMessage,
                  action: actionData,
                };
                return newMessages;
              });
            }
          } catch (e) {
            console.error('Error parsing SSE:', e);
          }
        }
      }
    } catch (error: any) {
      console.error('Error en Dogtor:', error);
      toast.error('Vaya, algo ha fallado. Intentalo de nuevo.');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (action: Message['action']) => {
    if (!action) return;

    switch (action.type) {
      case 'book_appointment':
        setIsOpen(false);
        if (isAuthenticated) {
          navigate('/dashboard?tab=appointments');
        } else {
          navigate('/auth');
        }
        break;
      case 'add_pet':
        setIsOpen(false);
        if (isAuthenticated) {
          navigate('/dashboard?tab=pets');
        } else {
          navigate('/auth');
        }
        break;
    }
  };

  return (
    <>
      {/* Popup notification after 30 seconds */}
      {showPopup && !isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
          <Card className="w-72 shadow-xl border-2 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <img
                  src={dogtorAvatar}
                  alt="Dogtor"
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Habla con el Dogtor!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Puedo ayudarte con citas, dudas sobre tu mascota y mas.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={handleOpenChat} className="text-xs">
                      Chatear
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowPopup(false)} className="text-xs">
                      Ahora no
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat button */}
      <Button
        onClick={() => {
          setShowPopup(false);
          setIsOpen(!isOpen);
        }}
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 p-0 overflow-hidden border-2 border-white"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <img
            src={dogtorAvatar}
            alt="Dogtor"
            className="w-full h-full object-cover"
          />
        )}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[520px] shadow-2xl z-50 flex flex-col border-2 border-primary/20">
          <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center gap-3">
              <img
                src={dogtorAvatar}
                alt="Dogtor"
                className="w-10 h-10 rounded-full object-cover border-2 border-primary"
              />
              <div>
                <h3 className="font-semibold">Dogtor</h3>
                <p className="text-xs text-muted-foreground">
                  Tu asistente veterinario molongo
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-4 pb-4">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <img
                      src={dogtorAvatar}
                      alt="Dogtor"
                      className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0"
                    />
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>

                {/* Action buttons */}
                {msg.action && (
                  <div className="mt-3 ml-10">
                    {msg.action.type === 'book_appointment' && (
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => handleAction(msg.action)}
                      >
                        <Calendar className="h-4 w-4" />
                        Ir a pedir cita
                      </Button>
                    )}
                    {msg.action.type === 'add_pet' && (
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => handleAction(msg.action)}
                      >
                        <PawPrint className="h-4 w-4" />
                        Registrar mascota
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <img
                  src={dogtorAvatar}
                  alt="Dogtor"
                  className="w-8 h-8 rounded-full object-cover mr-2"
                />
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <div className="p-4 border-t bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Preguntame lo que quieras..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim() || isRateLimited}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            {isRateLimited && (
              <p className="text-xs text-destructive mt-2 text-center font-medium">
                Espera {remainingTime}s para seguir preguntando
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Urgencias: 918 57 43 79
            </p>
          </div>
        </Card>
      )}
    </>
  );
}

export default VetChatbot;
