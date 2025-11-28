import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar, MessageCircle, Heart, Activity, Pill,
  Search, Menu, X, Instagram, Facebook, Camera,
  Plus, Trash2, ChevronRight, Clock, MapPin, Phone, Mail,
  PawPrint, User, Stethoscope, Syringe, ShieldAlert, ArrowLeft, Info, Thermometer,
  LogOut, Lock, CheckCircle, Sparkles, Loader2
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

// --- CONFIGURACIÓN DE FIREBASE (¡Rellena esto!) ---
// Ve a la consola de Firebase > Configuración del proyecto > General > Tus apps > SDK config
const firebaseConfig = {
  apiKey: "TU_API_KEY_DE_FIREBASE",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const appId = "vetwonder-prod"; // Identificador para la colección en la DB

// --- CONFIGURACIÓN GEMINI API (¡Rellena esto!) ---
// Consigue tu API Key en: https://aistudio.google.com/
const apiKey = "TU_API_KEY_DE_GEMINI"; 

// Función auxiliar para llamar a Gemini con reintentos
async function callGemini(prompt, systemInstruction = "") {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  const delays = [1000, 2000, 4000];
  for (let i = 0; i <= delays.length; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude procesar tu solicitud en este momento.";
    } catch (error) {
      if (i === delays.length) return "Hubo un error de conexión con la IA. Por favor intenta de nuevo.";
      await new Promise(resolve => setTimeout(resolve, delays[i]));
    }
  }
}

// --- IMÁGENES DE STOCK ---
const IMAGES = {
    hero: "https://images.unsplash.com/photo-1544568100-847a9480835b?auto=format&fit=crop&w=800&q=80",
    collaboration: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    petPlaceholder: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80",
    procesionaria: "https://images.unsplash.com/photo-1596716035088-293673c6838a?auto=format&fit=crop&w=800&q=80",
    vacuna: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
    leishmania: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=800&q=80",
    googleLogo: "https://www.svgrepo.com/show/475656/google-color.svg"
};

// --- COMPONENTES FUNCIONALES ---

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  const bgColors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600' };
  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColors[type]} text-white px-5 py-3 rounded-lg shadow-xl flex items-center space-x-3 animate-fade-in`}>
      <span>{message}</span>
      <button onClick={onClose}><X size={18} /></button>
    </div>
  );
};

// --- CHATBOT ---
const ChatBot = ({ onOpenAppointment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "¡Hola! Soy VetBot 🤖. ¿Tienes alguna duda sobre tu mascota o quieres pedir cita?", isBot: true }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const systemPrompt = `
    Eres VetBot, el asistente virtual de la clínica veterinaria "VetWonder" en Moralzarzal, Madrid.
    Tu tono es profesional, empático y servicial.
    Objetivos:
    1. Resolver dudas breves sobre salud animal.
    2. Derivar a pedir cita presencial.
    3. DETECTAR URGENCIAS VITALES. Si detectas una, responde SOLO con advertencia grave y pide llamar al 651 50 38 27.
    Responde de forma concisa.
  `;

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { text: userText, isBot: false }]);
    setInput("");
    setIsTyping(true);

    if (userText.toLowerCase().includes('cita') || userText.toLowerCase().includes('reservar')) {
        onOpenAppointment();
    }

    try {
        const response = await callGemini(userText, systemPrompt);
        setMessages(prev => [...prev, { text: response, isBot: true }]);
    } catch (error) {
        setMessages(prev => [...prev, { text: "Lo siento, tuve un problema técnico. ¿Podrías llamar a la clínica?", isBot: true }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-80 h-96 mb-4 flex flex-col border border-gray-200 overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 text-white flex justify-between items-center shadow-md">
            <span className="font-bold flex items-center text-sm"><Sparkles size={16} className="mr-2 text-yellow-200"/> VetBot IA</span>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1"><X size={16}/></button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${m.isBot ? 'bg-white text-gray-800 rounded-tl-none' : 'bg-orange-500 text-white rounded-tr-none'}`}>
                    {m.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-xs text-gray-400 ml-2 flex items-center"><Loader2 className="animate-spin mr-1" size={12}/> Pensando...</div>}
          </div>
          <div className="p-3 bg-white border-t flex gap-2">
            <input 
                className="flex-1 p-2 bg-gray-100 border-0 rounded-full text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e=>e.key==='Enter' && handleSend()} 
                placeholder="Escribe..." 
            />
            <button onClick={handleSend} className="p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors shadow-sm"><ChevronRight size={18}/></button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="h-14 w-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform border-2 border-white relative">
        {isOpen ? <X size={24}/> : <MessageCircle size={28}/>}
      </button>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL (App) ---
export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('inicio');
  const [selectedPost, setSelectedPost] = useState(null);
  const [toast, setToast] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (message, type = 'info') => setToast({ message, type });

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast("¡Bienvenido a VetWonder!", "success");
    } catch (error) {
      console.error(error);
      // En entorno local, esto no debería fallar si Firebase está bien configurado
      showToast("Error al iniciar sesión con Google.", "error");
    }
  };

  const handleLogout = async () => {
      await signOut(auth);
      showToast("Sesión cerrada", "info");
      setActiveTab('inicio');
  };

  // ... (Resto del código de Navigation, Hero, ClientArea, Blog, AppointmentForm)
  // Para brevedad en el export, el resto de la lógica es IDÉNTICA a la versión anterior
  // solo que ahora reside dentro de este archivo App.jsx.
  
  const Navigation = () => (
    <nav className="bg-white shadow-sm sticky top-0 z-30 font-sans backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => { setActiveTab('inicio'); setSelectedPost(null); }}>
            <div className="bg-orange-100 p-2 rounded-lg mr-2">
                <PawPrint className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">Vet<span className="text-orange-600">Wonder</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {['Inicio', 'Área Cliente', 'Blog', 'Citas'].map((label) => {
                const id = label.toLowerCase().replace(' ', '_');
                return (
                  <button key={id} onClick={() => { setActiveTab(id); setSelectedPost(null); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === id ? 'text-orange-600 bg-orange-50 ring-1 ring-orange-200' : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'}`}>
                    {label}
                  </button>
                )
            })}
          </div>
          <div className="hidden md:flex items-center space-x-4">
             {user ? (
                 <div className="flex items-center space-x-2 pl-4 border-l">
                     <img src={user.photoURL || IMAGES.petPlaceholder} className="w-8 h-8 rounded-full border border-gray-200" alt="Avatar"/>
                     <button onClick={handleLogout} className="text-gray-400 hover:text-red-500"><LogOut size={18}/></button>
                 </div>
             ) : (
                <button onClick={() => setActiveTab('área_cliente')} className="text-sm font-medium text-gray-600 hover:text-orange-600">Entrar</button>
             )}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-500 hover:text-orange-600"><Menu size={24} /></button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full z-20">
          <div className="px-4 pt-4 pb-6 space-y-2">
             {['Inicio', 'Área Cliente', 'Blog', 'Citas'].map((label) => (
                <button key={label} onClick={() => { setActiveTab(label.toLowerCase().replace(' ', '_')); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-lg font-medium hover:bg-orange-50 text-gray-700">{label}</button>
             ))}
          </div>
        </div>
      )}
    </nav>
  );

  const Hero = () => (
    <div className="relative bg-gray-50 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4">Veterinaria en Moralzarzal</span>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6">
                <span className="block xl:inline">Salud animal con</span>{' '}
                <span className="block text-orange-600 xl:inline">ciencia y corazón</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Especialistas en medicina preventiva, cirugía y diagnóstico avanzado.
              </p>
              <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                  <button onClick={() => setActiveTab('citas')} className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 md:py-4 md:text-lg shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1">Pedir Cita Online</button>
                  <button onClick={() => setActiveTab('área_cliente')} className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border-2 border-orange-100 text-base font-medium rounded-lg text-orange-700 bg-white hover:bg-orange-50 md:py-4 md:text-lg transition-colors">Área Privada</button>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-white flex items-center justify-center">
        <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src={IMAGES.hero} alt="Veterinaria minimalista" />
      </div>
    </div>
  );

  const ClientArea = () => {
      const [pets, setPets] = useState([]);
      const [viewMode, setViewMode] = useState('dashboard');
      const [newPet, setNewPet] = useState({ name: '', species: 'Perro', breed: '', age: '', photoUrl: null });
      const [aiAdvice, setAiAdvice] = useState(null);
      const [adviceLoadingId, setAdviceLoadingId] = useState(null);
      const fileInputRef = useRef(null);

      useEffect(() => {
        if (!user) return;
        const q = collection(db, 'artifacts', appId, 'users', user.uid, 'pets');
        const unsub = onSnapshot(q, (s) => setPets(s.docs.map(d => ({ id: d.id, ...d.data() }))));
        return () => unsub();
      }, [user]);

      const handleGenerateAdvice = async (pet) => {
          setAdviceLoadingId(pet.id);
          setAiAdvice(null);
          const prompt = `Genera 3 consejos de salud preventivos breves para un ${pet.species} raza ${pet.breed || 'mestiza'} de ${pet.age || '?'} años.`;
          try {
              const advice = await callGemini(prompt);
              setAiAdvice({ petId: pet.id, text: advice });
          } catch (e) { showToast("Error al generar consejo", "error"); } 
          finally { setAdviceLoadingId(null); }
      };

      if (!user) {
          return (
              <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                  <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                      <div className="text-center">
                          <Lock className="mx-auto h-12 w-12 text-orange-600 mb-4" />
                          <h2 className="text-3xl font-extrabold text-gray-900">Área Clientes</h2>
                          <p className="mt-2 text-sm text-gray-600">Accede para gestionar tus mascotas.</p>
                      </div>
                      <div className="mt-8 space-y-4">
                          <button onClick={handleGoogleLogin} className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                              <img src={IMAGES.googleLogo} alt="Google" className="h-5 w-5 mr-3"/> Continuar con Google
                          </button>
                      </div>
                  </div>
              </div>
          );
      }

      const handleAddPet = async (e) => {
          e.preventDefault();
          await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'pets'), { ...newPet, createdAt: serverTimestamp() });
          setViewMode('dashboard'); setNewPet({name:'', species:'Perro', breed:'', age:'', photoUrl:null});
          showToast("Mascota añadida", "success");
      };
      
      const handleFileChange = (e) => {
          const file = e.target.files[0];
          if (file) { const r = new FileReader(); r.onloadend = () => setNewPet({...newPet, photoUrl: r.result}); r.readAsDataURL(file); }
      };

      return (
          <div className="max-w-7xl mx-auto px-4 py-10">
              <div className="flex justify-between items-center mb-10 border-b pb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Hola, {user.displayName || 'Usuario'}</h2>
                  <button onClick={() => setViewMode(viewMode === 'dashboard' ? 'add_pet' : 'dashboard')} className="px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700">{viewMode === 'dashboard' ? 'Nueva Mascota' : 'Volver'}</button>
              </div>

              {viewMode === 'add_pet' ? (
                  <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                      <h3 className="text-xl font-bold mb-6">Ficha de Nuevo Paciente</h3>
                      <div className="flex justify-center mb-6 cursor-pointer" onClick={() => fileInputRef.current.click()}>
                          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 relative">
                              {newPet.photoUrl ? <img src={newPet.photoUrl} className="w-full h-full object-cover"/> : <Camera className="text-gray-400"/>}
                          </div>
                          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*"/>
                      </div>
                      <form onSubmit={handleAddPet} className="space-y-5">
                          <div className="grid grid-cols-2 gap-4">
                            <input className="w-full border p-3 rounded-lg" placeholder="Nombre" value={newPet.name} onChange={e=>setNewPet({...newPet, name:e.target.value})} required/>
                            <input className="w-full border p-3 rounded-lg" placeholder="Raza" value={newPet.breed} onChange={e=>setNewPet({...newPet, breed:e.target.value})}/>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <select className="w-full border p-3 rounded-lg" value={newPet.species} onChange={e=>setNewPet({...newPet, species:e.target.value})}>
                                <option>Perro</option><option>Gato</option><option>Exótico</option>
                            </select>
                            <input type="number" className="w-full border p-3 rounded-lg" placeholder="Edad" value={newPet.age} onChange={e=>setNewPet({...newPet, age:e.target.value})}/>
                          </div>
                          <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold">Guardar Ficha</button>
                      </form>
                  </div>
              ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                      {pets.length === 0 && <div className="col-span-2 text-center py-12 bg-gray-50 rounded-xl text-gray-500">No hay mascotas registradas.</div>}
                      {pets.map(p => (
                          <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                              <div className="h-40 relative overflow-hidden">
                                  <img src={p.photoUrl || IMAGES.petPlaceholder} className="w-full h-full object-cover"/>
                                  <button onClick={()=>deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'pets', p.id))} className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow"><Trash2 size={14}/></button>
                              </div>
                              <div className="p-4">
                                  <div className="flex justify-between items-center mb-3">
                                      <h4 className="font-bold text-xl">{p.name}</h4>
                                      <span className="text-xs text-gray-500">{p.species}</span>
                                  </div>
                                  <div className="mb-4">
                                      {aiAdvice?.petId === p.id ? (
                                          <div className="bg-orange-50 p-3 rounded-lg text-xs text-gray-700 border border-orange-100">
                                              <p className="font-bold text-orange-700 mb-1 flex items-center"><Sparkles size={12} className="mr-1"/> Consejos IA:</p>
                                              <div className="whitespace-pre-wrap">{aiAdvice.text}</div>
                                          </div>
                                      ) : (
                                          <button onClick={() => handleGenerateAdvice(p)} disabled={adviceLoadingId === p.id} className="w-full py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded border border-purple-100 flex justify-center">
                                              {adviceLoadingId === p.id ? <Loader2 size={14} className="animate-spin"/> : <><Sparkles size={14} className="mr-1"/> Ver Consejos IA</>}
                                          </button>
                                      )}
                                  </div>
                                  <button onClick={()=>{setActiveTab('citas'); showToast(`Cita para ${p.name}`, 'success')}} className="w-full py-2 bg-orange-50 text-orange-700 font-bold text-sm rounded-lg hover:bg-orange-100">Pedir Cita</button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      );
  };

  const Blog = () => {
    // (Contenido simplificado para el export, igual que versiones previas)
    const posts = [
        { id: 1, title: "¡Cuidado con la Procesionaria!", category: "Alerta", date: "Urgente", headerImage: IMAGES.procesionaria },
        { id: 2, title: "Campaña Vacunación Rabia", category: "Normativa", date: "Campaña", headerImage: IMAGES.vacuna },
        { id: 3, title: "Leishmaniosis", category: "Prevención", date: "Prevención", headerImage: IMAGES.leishmania }
    ];
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-end mb-8 border-b pb-4"><div><h2 className="text-3xl font-bold text-gray-900">Blog Veterinario</h2></div></div>
        <div className="grid md:grid-cols-3 gap-8">{posts.map(p => (<article key={p.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all cursor-pointer group"><div className="h-48 overflow-hidden"><img src={p.headerImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/></div><div className="p-6"><h3 className="text-xl font-bold mb-2 group-hover:text-orange-600">{p.title}</h3></div></article>))}</div>
      </div>
    );
  };

  const AppointmentForm = () => {
    const [formData, setFormData] = useState({ ownerName: '', petName: '', date: '', time: '', reason: 'Consulta General', phone: '' });
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!auth.currentUser) await signInAnonymously(auth);
      setStatus('syncing');
      setTimeout(async () => {
          try {
            await addDoc(collection(db, 'artifacts', appId, 'users', auth.currentUser?.uid || 'guest', 'appointments'), { ...formData, createdAt: serverTimestamp() });
            setStatus('success');
            setFormData({ ownerName: '', petName: '', date: '', time: '', reason: 'Consulta General', phone: '' });
          } catch(err) { showToast("Error al reservar", "error"); setStatus('idle'); }
      }, 1500);
    };

    if(status === 'success') return (<div className="max-w-xl mx-auto py-20 text-center"><CheckCircle className="text-green-600 mx-auto mb-6" size={40}/><h2 className="text-3xl font-bold mb-4">¡Cita Solicitada!</h2><button onClick={()=>setStatus('idle')} className="text-orange-600 font-bold hover:underline">Volver</button></div>);

    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-gray-200">
          <div className="bg-gray-900 p-8 text-white lg:w-2/5"><h2 className="text-2xl font-bold mb-4">Reserva Online</h2><p className="text-gray-400 mb-6 text-sm">IA verificando agenda...</p></div>
          <div className="p-8 lg:w-3/5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <input className="w-full border p-3 rounded-lg" placeholder="Tu Nombre" value={formData.ownerName} onChange={e=>setFormData({...formData, ownerName:e.target.value})} required/>
              <input className="w-full border p-3 rounded-lg" placeholder="Mascota" value={formData.petName} onChange={e=>setFormData({...formData, petName:e.target.value})} required/>
              <input type="date" className="w-full border p-3 rounded-lg" value={formData.date} onChange={e=>setFormData({...formData, date:e.target.value})} required/>
              <button disabled={status === 'syncing'} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold">{status === 'syncing' ? 'Reservando...' : 'Confirmar'}</button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Navigation />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <main className="flex-grow">
        {activeTab === 'inicio' && (
          <>
            <Hero />
            <div className="bg-orange-50 py-16"><div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center"><div className="lg:w-1/2 mb-8 lg:mb-0"><h2 className="text-3xl font-extrabold mb-4">Proyecto <span className="text-orange-600">Huella de Wonder</span></h2><p className="mb-6">Solidaridad animal.</p></div><div className="lg:w-1/2 flex justify-center"><img src={IMAGES.collaboration} className="rounded-2xl shadow-2xl max-h-80"/></div></div></div>
          </>
        )}
        {activeTab === 'área_cliente' && <ClientArea />}
        {activeTab === 'blog' && <Blog />}
        {activeTab === 'citas' && <AppointmentForm />}
      </main>
      <ChatBot onOpenAppointment={() => setActiveTab('citas')} />
      <footer className="bg-gray-900 text-gray-400 py-10 border-t border-gray-800">
         <div className="max-w-7xl mx-auto px-4 text-center">
             <p className="mb-2">© 2025 VetWonder Moralzarzal</p>
             <a href="https://automomio.es" target="_blank" className="inline-block px-3 py-1 bg-gray-800 rounded-full text-xs text-orange-500">⚡ Web por Automomio.es</a>
         </div>
      </footer>
    </div>
  );
}