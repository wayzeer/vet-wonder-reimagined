import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useRateLimit } from "@/hooks/useRateLimit";
import { z } from "zod";

// Input validation
const messageSchema = z.string()
  .trim()
  .min(1, "El mensaje no puede estar vacío")
  .max(500, "El mensaje no puede exceder 500 caracteres");

interface Message {
  role: 'user' | 'assistant';
  content: string;
  showBookingForm?: boolean;
}

export function VetChatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy VetBot, tu asistente veterinario virtual de VetWonder. ¿En qué puedo ayudarte hoy? 🐾'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Rate limiting: 10 mensajes cada 5 minutos
  const { checkRateLimit, isRateLimited, remainingTime } = useRateLimit({
    maxAttempts: 10,
    windowMs: 5 * 60 * 1000, // 5 minutos
    storageKey: 'chatbot_rate_limit',
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      toast.error(`Demasiadas consultas. Espera ${remainingTime} segundos o llama al 918 57 43 79.`);
      return;
    }

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-veterinario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error('Se ha alcanzado el límite de consultas. Llama al 918 57 43 79');
          return;
        }
        if (response.status === 402) {
          toast.error('Servicio temporalmente no disponible. Llama al 918 57 43 79');
          return;
        }
        throw new Error('Error al procesar tu consulta');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let buffer = '';

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
              
              // Detectar si debe mostrar formulario de citas
              const showBooking = assistantMessage.includes('[SHOW_BOOKING_FORM]');
              
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = assistantMessage.replace('[SHOW_BOOKING_FORM]', '');
                newMessages[newMessages.length - 1].showBookingForm = showBooking;
                return newMessages;
              });
            }
          } catch (e) {
            console.error('Error parsing SSE:', e);
          }
        }
      }
    } catch (error: any) {
      console.error('Error en chatbot:', error);
      toast.error('Error al conectar con el asistente');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              🐾 VetBot - Asistente Virtual
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Respuestas rápidas sobre salud animal
            </p>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-4 pb-4">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
                
                {/* Formulario inline de reserva */}
                {msg.showBookingForm && (
                  <div className="mt-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-sm">Reservar Cita</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Te redirigiremos a tu área privada para completar la reserva
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/auth');
                      }}
                    >
                      Ir a Reservar Cita
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <div className="p-4 border-t">
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
                placeholder="Escribe tu consulta..."
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim() || isRateLimited}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            {isRateLimited && (
              <p className="text-xs text-destructive mt-2 text-center font-medium">
                Límite alcanzado. Espera {remainingTime}s
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2 text-center">
              En urgencias, llama al 918 57 43 79
            </p>
          </div>
        </Card>
      )}
    </>
  );
}

export default VetChatbot;
