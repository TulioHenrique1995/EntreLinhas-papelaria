import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    Gift,
    Truck,
    Heart,
    CheckCircle,
    Instagram,
    MessageCircle,
    ArrowRight,
    Menu,
    X,
    Palette,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';

// --- TYPES ---
type Product = {
    id: string;
    name: string;
    price: string;
    image: string;
    category: 'agenda' | 'caderno' | 'festa';
};

// --- DATA ---
// --- ENHANCED DATA ---
const AGENDAS_LIST: Product[] = [
    { id: '1', name: "Agenda Floral Soft", price: "", category: 'agenda', image: "/agenda_real.jpg" },
    { id: '2', name: "Planner Executivo", price: "", category: 'agenda', image: "/agenda_real.jpg" },
    { id: '3', name: "Agenda Clean Tone", price: "", category: 'agenda', image: "/agenda_real.jpg" },
];

const CADERNOS_LIST: Product[] = [
    { id: '4', name: "Caderno Dinossauro", price: "", category: 'caderno', image: "/hero_dino.jpg" },
    { id: '5', name: "Caderno Homem-Aranha", price: "", category: 'caderno', image: "/hero_spider.jpg" },
    { id: '6', name: "Caderno Sonic", price: "", category: 'caderno', image: "/hero_sonic.jpg" },
    { id: '7', name: "Caderno Meninas", price: "", category: 'caderno', image: "/hero_girls.jpg" },
    { id: '8', name: "Caderno Unicórnio", price: "", category: 'caderno', image: "/hero_unicorn.jpg" },
];

const FESTA_ITEMS: Product[] = [
    { id: 'f1', name: "Kits Temáticos", price: "", category: 'festa', image: "/festa_1.jpg" },
    { id: 'f2', name: "Caixas com Visor", price: "", category: 'festa', image: "/festa_3.jpg" },
    { id: 'f3', name: "Caixas Milk", price: "", category: 'festa', image: "/festa_2.jpg" },
    { id: 'f4', name: "Personalizados de Luxo", price: "", category: 'festa', image: "/festa_4.jpg" },
];

const HERO_IMAGES = [
    "/hero_dino.jpg",
    "/hero_spider.jpg",
    "/hero_sonic.jpg",
    "/hero_girls.jpg",
    "/hero_unicorn.jpg",
    "/festa_1.jpg",
    "/festa_2.jpg",
    "/festa_3.jpg",
    "/festa_4.jpg",
    "/agenda_real.jpg"
];

// --- VÍDEOS DOS PERSONALIZADOS ---
// IMPORTANTE: Para vídeos tocarem direto no site (sem redirecionar):
// 1. Baixe o vídeo do Instagram/TikTok
// 2. Coloque o arquivo .mp4 na pasta 'public' (ex: public/video_agenda.mp4)
// 3. Use type: 'local' e url: '/video_agenda.mp4'
//
// Alternativa: Use YouTube (funciona melhor que Instagram para embed)
const VIDEOS = [
    {
        id: 1,
        title: "Agenda Personalizada",
        type: 'local' as const,
        url: "/video_agenda.mp4.mp4",
        thumbnail: "/agenda_real.jpg"
    },
    {
        id: 2,
        title: "Caderno Temático",
        type: 'local' as const,
        url: "/video_caderno.mp4.mp4",
        thumbnail: "/hero_spider.jpg"
    },
    {
        id: 3,
        title: "Kit Festa Completo",
        type: 'local' as const,
        url: "/video_festa.mp4.mp4",
        thumbnail: "/festa_1.jpg"
    }
];

const LandingPage = () => {
    // --- STATE ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Wizard State
    const [step, setStep] = useState(1);
    const [customName, setCustomName] = useState(''); // Used for Name on Cover / Student Name / Birthday Person

    // Specific States for Product Types
    const [themePreference, setThemePreference] = useState(''); // 'Tema da Agenda' or 'Tema do Caderno'
    const [schoolGrade, setSchoolGrade] = useState(''); // 'Série/Turma' for Caderno
    const [schoolSubject, setSchoolSubject] = useState(''); // 'Matéria' for Caderno

    // Festa States
    const [partyTheme, setPartyTheme] = useState('');
    const [partyAge, setPartyAge] = useState('');
    const [partyDate, setPartyDate] = useState('');

    // Carousel States
    const [agendaIndex, setAgendaIndex] = useState(0);
    const [cadernoIndex, setCadernoIndex] = useState(0);
    const [festaIndex, setFestaIndex] = useState(0);

    // Scroll to top button visibility
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Toast auto-hide
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // Carousel Helper
    const renderCarousel = (items: Product[], currentIndex: number, setIndex: (i: any) => void, onSelect: (p: Product) => void, variant: 'portrait' | 'square' = 'portrait') => {
        const next = () => setIndex((prev: number) => (prev + 1) % items.length);
        const prev = () => setIndex((prev: number) => (prev - 1 + items.length) % items.length);

        const getVisibleItems = () => {
            const prevIndex = (currentIndex - 1 + items.length) % items.length;
            const nextIndex = (currentIndex + 1) % items.length;
            return [
                { ...items[prevIndex], position: 'left' },
                { ...items[currentIndex], position: 'center' },
                { ...items[nextIndex], position: 'right' }
            ];
        };

        const cardDimensions = variant === 'portrait'
            ? (isCenter: boolean) => isCenter ? 'w-[280px] h-[380px] md:w-[350px] md:h-[450px]' : 'w-[240px] h-[320px]'
            : (isCenter: boolean) => isCenter ? 'w-[300px] h-[300px] md:w-[400px] md:h-[400px]' : 'w-[250px] h-[250px]';

        return (
            <div className="relative h-[500px] flex items-center justify-center overflow-hidden">
                {/* Arrows */}
                <button onClick={prev} className="absolute left-2 md:left-10 z-30 p-3 bg-white/80 rounded-full shadow-lg text-pink-400 hover:text-pink-600 hover:scale-110 transition-all">
                    <ChevronLeft size={32} />
                </button>
                <button onClick={next} className="absolute right-2 md:right-10 z-30 p-3 bg-white/80 rounded-full shadow-lg text-pink-400 hover:text-pink-600 hover:scale-110 transition-all">
                    <ChevronRight size={32} />
                </button>

                {/* Items */}
                <div className="flex items-center justify-center w-full relative h-full">
                    <AnimatePresence mode='popLayout'>
                        {getVisibleItems().map((item) => {
                            const isCenter = item.position === 'center';
                            return (
                                <motion.div
                                    key={`${item.id}-${item.position}`}
                                    initial={{ opacity: 0, scale: 0.8, x: item.position === 'left' ? -100 : item.position === 'right' ? 100 : 0 }}
                                    animate={{
                                        opacity: isCenter ? 1 : 0.5,
                                        scale: isCenter ? 1 : 0.8,
                                        x: item.position === 'left' ? -120 : item.position === 'right' ? 120 : 0,
                                        zIndex: isCenter ? 20 : 10,
                                        filter: isCenter ? 'blur(0px)' : 'blur(2px)'
                                    }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className={`absolute rounded-3xl overflow-hidden shadow-2xl cursor-pointer bg-white border-4 border-pink-200 flex flex-col
                                        ${cardDimensions(isCenter)} ${!isCenter && 'grayscale'}`}
                                    onClick={() => isCenter ? onSelect(item) : (item.position === 'right' ? next() : prev())}
                                >
                                    <div className="flex-1 w-full h-full relative overflow-hidden bg-white p-2">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    </div>

                                    {isCenter && (
                                        <div className="w-full bg-white/90 p-4 text-center border-t border-pink-100 shadow-sm shrink-0 z-20">
                                            <h3 className="font-bold text-lg text-pink-700">{item.name}</h3>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                                                <MessageCircle size={14} /> Solicitar Orçamento
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        );
    };


    const [heroIndex, setHeroIndex] = useState(0);

    // --- EFFECTS ---
    useEffect(() => {
        const timer = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000); // 5 segundos: tempo mais lento e agradável
        return () => clearInterval(timer);
    }, []);

    // --- HANDLERS ---
    const openPersonalization = (product?: Product) => {
        setSelectedProduct(product || null);
        setStep(1);
        setModalOpen(true);
        // Reset states
        setCustomName('');
        setThemePreference('');
        setSchoolGrade('');
        setSchoolSubject('');
        setPartyAge('');
        setPartyTheme('');
        setPartyDate('');
    };

    const openPartyPersonalization = () => {
        setSelectedProduct({ id: 'party-custom', name: 'Kit Festa Personalizado', price: 'A Combinar', category: 'festa', image: 'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?auto=format&fit=crop&q=80&w=400' });
        setStep(1);
        setModalOpen(true);
    }

    // Validate if user can proceed to next step
    const canProceedToNextStep = (): boolean => {
        if (step === 1) {
            return selectedProduct !== null;
        }
        if (step === 2) {
            // Check required fields based on product category
            if (selectedProduct?.category === 'festa') {
                return customName.trim() !== '' && partyTheme.trim() !== '';
            }
            if (selectedProduct?.category === 'caderno') {
                return customName.trim() !== '' && themePreference.trim() !== '';
            }
            if (selectedProduct?.category === 'agenda') {
                return customName.trim() !== '' && themePreference.trim() !== '';
            }
        }
        return true;
    };

    const handleNextStep = () => {
        if (canProceedToNextStep() && step < 3) {
            setStep(step + 1);
        }
    };

    const handlePrevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleFinish = () => {
        let msg = '';
        const productName = selectedProduct?.name || 'Personalizado';

        if (selectedProduct?.category === 'festa') {
            msg = `Olá! Gostaria de um orçamento para o item: *${productName}*\n\n` +
                `*Detalhes do Evento:*\n` +
                `- Tema: ${partyTheme}\n` +
                `- Aniversariante: ${customName}\n` +
                `- Idade: ${partyAge}\n` +
                `- Data: ${partyDate}`;
        } else if (selectedProduct?.category === 'caderno') {
            msg = `Olá! Gostaria de encomendar: *${productName}*\n\n` +
                `*Detalhes do Caderno:*\n` +
                `- Tema Escolhido: ${themePreference}\n` +
                `- Nome do Aluno: ${customName}\n` +
                `- Série/Turma: ${schoolGrade}\n` +
                `- Matéria: ${schoolSubject}`;
        } else {
            // Agenda or Default
            msg = `Olá! Gostaria de encomendar: *${productName}*\n\n` +
                `*Detalhes da Agenda:*\n` +
                `- Tema da Capa: ${themePreference}\n` +
                `- Nome na Capa: ${customName}\n` +
                `- Ano: 2026`;
        }

        // WhatsApp API - Compatível com WhatsApp e WhatsApp Business
        const url = `https://api.whatsapp.com/send?phone=5531995057791&text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');

        // Show success feedback
        setShowToast(true);
        setModalOpen(false);
    };

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#FDF2F8] font-sans text-[#831843]">
            {/* --- FONTS --- */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Nunito+Sans:wght@300;400;600;700&family=Rubik:wght@400;500;700&display=swap');
        html { scroll-behavior: smooth; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Rubik', sans-serif; }
        .font-brand { font-family: 'Dancing Script', cursive; }
        body { font-family: 'Nunito Sans', sans-serif; }
      `}</style>

            {/* --- HEADER --- */}
            <header className="fixed w-full z-50 bg-[#FDF2F8]/90 backdrop-blur-md shadow-sm border-b border-pink-100">
                <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <img src="/logo_new.jpg" alt="Entre Linhas Logo" className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-white transform hover:scale-105 transition-transform" />
                        <span className="font-brand text-4xl text-pink-600 drop-shadow-sm select-none">Entre Linhas</span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 font-medium">
                        <a href="#agendas" className="hover:text-pink-600 transition-colors">Agendas</a>
                        <a href="#cadernos" className="hover:text-pink-600 transition-colors">Cadernos</a>
                        <a href="#aniversario" className="hover:text-pink-600 transition-colors">Festas</a>
                        <button
                            onClick={() => openPersonalization()}
                            className="bg-[#06B6D4] hover:bg-[#0891b2] text-white px-5 py-2 rounded-full font-bold shadow-md transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                            <MessageCircle size={18} />
                            Personalizar
                        </button>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden p-2 text-pink-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-b border-pink-100 p-4 flex flex-col gap-4 shadow-lg absolute w-full z-50">
                        <a href="#agendas" className="font-medium text-lg px-2" onClick={() => setIsMenuOpen(false)}>Agendas</a>
                        <a href="#cadernos" className="font-medium text-lg px-2" onClick={() => setIsMenuOpen(false)}>Cadernos</a>
                        <a href="#aniversario" className="font-medium text-lg px-2" onClick={() => setIsMenuOpen(false)}>Festas</a>
                        <button
                            onClick={() => { setIsMenuOpen(false); openPersonalization(); }}
                            className="bg-[#06B6D4] text-white w-full py-3 rounded-xl font-bold mt-2"
                        >
                            Personalizar Agora
                        </button>
                    </div>
                )}
            </header>

            {/* --- 1️⃣ HERO SECTION --- */}
            <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 overflow-hidden relative">
                <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6 text-center md:text-left z-10"
                    >
                        <div className="inline-block px-4 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-bold tracking-wide mb-2 animate-fade-in">
                            ✨ Papelaria que emociona
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Papelaria Criativa e Personalizados que <span className="text-pink-500 font-brand text-5xl md:text-7xl block mt-2">Contam Histórias</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
                            Agendas, cadernos exclusivos e personalizados únicos para aniversários e momentos especiais. Feito à mão, com o coração.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                            <a href="#agendas" className="bg-[#06B6D4] hover:bg-[#0891b2] text-white px-8 py-4 rounded-full font-bold shadow-lg text-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-1">
                                Ver Agendas
                                <ArrowRight size={20} />
                            </a>
                            <button onClick={() => openPersonalization()} className="bg-white border-2 border-pink-200 text-pink-600 hover:bg-pink-50 px-8 py-4 rounded-full font-bold text-lg transition-all hover:-translate-y-1">
                                Personalizar Meu Produto
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Blob Decorations */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-700"></div>

                        {/* Images Carousel */}
                        <div className="relative z-10 grid grid-cols-2 gap-4 h-[400px]">
                            <AnimatePresence>
                                <motion.img
                                    key={heroIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 2.5, ease: "easeInOut" }}
                                    src={HERO_IMAGES[heroIndex]}
                                    alt="Caderno Personalizado"
                                    className="rounded-2xl shadow-2xl border-4 border-white aspect-[3/4] object-cover absolute top-0 left-0 w-[48%] h-auto transform rotate-[-3deg] hover:rotate-0 transition-all z-10"
                                />
                                <motion.img
                                    key={(heroIndex + 1) % HERO_IMAGES.length}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                                    src={HERO_IMAGES[(heroIndex + 1) % HERO_IMAGES.length]}
                                    alt="Caderno Personalizado 2"
                                    className="rounded-2xl shadow-2xl border-4 border-white aspect-[3/4] object-cover absolute top-12 right-0 w-[48%] h-auto transform rotate-[3deg] hover:rotate-0 transition-all"
                                />
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- 2️⃣ BENEFÍCIOS --- */}
            <section className="py-12 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        {[
                            { icon: <Palette size={32} className="text-[#06B6D4]" />, title: "100% Personalizável", desc: "Capa, miolo e detalhes" },
                            { icon: <Heart size={32} className="text-pink-500" />, title: "Feito à Mão", desc: "Produção artesanal cuidadosa" },
                            { icon: <Gift size={32} className="text-purple-500" />, title: "Presente Perfeito", desc: "Embalagem pronta para dar" },
                            { icon: <Truck size={32} className="text-green-500" />, title: "Entrega Segura", desc: "Para todo o Brasil" },
                            { icon: <MessageCircle size={32} className="text-yellow-500" />, title: "Atendimento VIP", desc: "Suporte personalizado" },
                        ].map((item, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                className="flex flex-col items-center text-center p-4 hover:bg-white hover:shadow-lg rounded-xl transition-all duration-300"
                            >
                                <div className="mb-3 p-3 bg-white rounded-2xl shadow-sm">{item.icon}</div>
                                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 2.5️⃣ SOBRE A CRIADORA --- */}
            <section className="py-16 bg-white overflow-hidden">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="md:w-1/3 relative"
                    >
                        <div className="absolute inset-0 bg-pink-200 rounded-full blur-3xl opacity-30 transform -translate-x-4 translate-y-4"></div>
                        <img src="/logo_new.jpg" alt="Criadora Entre Linhas" className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-8 border-pink-50 shadow-xl relative z-10 mx-auto" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="md:w-2/3 space-y-6 text-center md:text-left"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold">Olá! Sou a criadora da <span className="text-pink-500 font-brand text-4xl">Entre Linhas</span></h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Sempre fui apaixonada por papelaria e acredito que a organização pode ser leve e inspiradora. Cada agenda e caderno que sai do ateliê leva um pedacinho desse amor.
                            <br /><br />
                            Meu objetivo é criar ferramentas que ajudem você a realizar seus sonhos, com designs únicos que expressam sua personalidade. Seja bem-vindo(a) ao meu mundo colorido!
                        </p>
                        <div className="flex gap-4 justify-center md:justify-start pt-2">
                            <div className="flex items-center gap-2 text-pink-600 font-bold bg-pink-50 px-4 py-2 rounded-full">
                                <Heart size={18} /> Feito com Amor
                            </div>
                            <div className="flex items-center gap-2 text-[#06B6D4] font-bold bg-cyan-50 px-4 py-2 rounded-full">
                                <Star size={18} /> Design Exclusivo
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- 3️⃣ SEÇÃO AGENDAS --- */}
            <section id="agendas" className="py-20 container mx-auto px-4 bg-pink-50/30">
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#831843]">Agendas 2026</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-2 text-lg">Organize seu ano com estilo.</p>
                    <p className="text-pink-500 font-brand text-3xl mt-2">Monte sua agenda do seu jeito</p>
                </div>

                {renderCarousel(AGENDAS_LIST, agendaIndex, setAgendaIndex, openPersonalization)}
            </section>

            {/* --- 4️⃣ SEÇÃO CADERNOS ESCOLARES --- */}
            <section id="cadernos" className="py-20 container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#06B6D4]">Volta às Aulas 📚</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-2 text-lg">Cadernos com capas exclusivas dos seus personagens favoritos.</p>
                </div>

                {renderCarousel(CADERNOS_LIST, cadernoIndex, setCadernoIndex, openPersonalization)}
            </section>

            {/* --- 5️⃣ SEÇÃO FESTAS E ANIVERSÁRIOS --- */}
            <section id="aniversario" className="py-20 bg-gradient-to-b from-[#FDF2F8] to-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ec4899 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <span className="text-cyan-600 font-bold tracking-wider text-sm uppercase mb-2 block">Momento Especial</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#831843]">Personalizados para Sua Festa 🎈</h2>
                    <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-lg">Kits completos, convites e lembrancinhas que encantam.</p>

                    {renderCarousel(FESTA_ITEMS, festaIndex, setFestaIndex, (p) => { setSelectedProduct(p); setStep(2); setModalOpen(true); }, 'square')}

                    <button
                        onClick={() => openPartyPersonalization()}
                        className="mt-12 border-2 border-[#831843] text-[#831843] px-10 py-3 rounded-full font-bold hover:bg-[#831843] hover:text-white transition-all transform hover:scale-105"
                    >
                        Crie o Kit Perfeito para Seu Evento
                    </button>
                </div>
            </section>

            {/* --- 6️⃣ PROVA SOCIAL --- */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Quem Compra, Ama ❤️</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: "Mariana S.", role: "Estudante de Design", text: "A qualidade desse planner é surreal! O papel é grossinho e a capa ficou exatamente como eu queria. Amei!" },
                            { name: "Carla Eventos", role: "Organizadora", text: "Meus clientes sempre elogiam as lembrancinhas da Entre Linhas. Acabamento impecável e entrega no prazo." },
                            { name: "Beatriz M.", role: "Cliente Fiel", text: "Já é o terceiro caderno que compro. O atendimento no WhatsApp é super atencioso e carinhoso." }
                        ].map((dep, i) => (
                            <div key={i} className="bg-pink-50 p-8 rounded-2xl relative hover:shadow-lg transition-shadow">
                                <div className="flex text-yellow-400 mb-4 gap-1">
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-gray-700 italic mb-6">"{dep.text}"</p>
                                <div className="font-bold text-pink-900">{dep.name}</div>
                                <div className="text-xs text-pink-500 uppercase font-bold">{dep.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 6.5️⃣ GALERIA DE VÍDEOS --- */}
            <section className="py-20 bg-gradient-to-b from-white to-pink-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#831843]">Veja Nossos Personalizados 🎥</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">Confira alguns dos produtos que já criamos para nossos clientes</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 justify-items-center">
                        {VIDEOS.map((video) => (
                            <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 w-full max-w-[250px] md:max-w-[300px]">
                                {/* Formato 9:16 (TikTok/Reels) */}
                                <div className="relative w-full bg-gray-900" style={{ aspectRatio: '9 / 16' }}>
                                    {video.type === 'local' ? (
                                        <video
                                            src={video.url}
                                            poster={video.thumbnail}
                                            controls
                                            muted
                                            className="w-full h-full object-cover"
                                            preload="metadata"
                                        >
                                            Seu navegador não suporta o elemento de vídeo.
                                        </video>
                                    ) : (
                                        <iframe
                                            src={video.url}
                                            title={video.title}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    )}
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="font-bold text-lg text-pink-700">{video.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 7️⃣ COMO FUNCIONA (Passo a Passo) --- */}
            < section className="py-20 border-t border-pink-100 container mx-auto px-4" >
                <h2 className="text-center text-3xl font-bold mb-12">Como Funciona a Personalização?</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative">
                    {[
                        { step: "01", title: "Escolha", desc: "Selecione o produto e o modelo base" },
                        { step: "02", title: "Crie", desc: "Envie seu nome, frase ou tema" },
                        { step: "03", title: "Aprove", desc: "Receba uma prévia digital no WhatsApp" },
                        { step: "04", title: "Receba", desc: "Produção e envio com muito carinho" }
                    ].map((item, i) => (
                        <div key={i} className="relative z-10 p-4">
                            <div className="w-16 h-16 bg-[#06B6D4] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                                {item.step}
                            </div>
                            <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-500 max-w-[150px] mx-auto">{item.desc}</p>
                        </div>
                    ))}
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-pink-100 -z-50"></div>
                </div>
            </section >



            {/* --- 9️⃣ FINAL CTA --- */}
            < section className="py-24 text-center px-4" >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Transforme suas ideias em <br /><span className="text-pink-500 font-brand text-6xl">papelaria única</span></h2>
                <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">Não deixe suas memórias e planos em branco. Comece a criar seu personalizado hoje mesmo.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => openPersonalization()}
                        className="bg-[#06B6D4] hover:bg-[#0891b2] text-white px-10 py-5 rounded-full font-bold shadow-xl text-xl transition-transform hover:-translate-y-1"
                    >
                        Quero Personalizar
                    </button>
                    <a href="#agendas" className="bg-white border-2 border-[#06B6D4] text-[#06B6D4] hover:bg-[#ebfcfd] px-10 py-5 rounded-full font-bold text-xl flex items-center justify-center transition-transform hover:-translate-y-1">
                        Ver Catálogo
                    </a>
                    <button
                        onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                        className="flex items-center justify-center gap-2 text-green-600 bg-green-50 hover:bg-green-100 px-8 py-5 rounded-full font-bold text-lg border border-green-200 transition-transform hover:-translate-y-1"
                    >
                        <MessageCircle size={24} /> Falar no WhatsApp
                    </button>
                </div>
            </section >

            {/* --- 🔟 FOOTER --- */}
            < footer className="bg-white border-t border-pink-100 pt-16 pb-8" >
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/logo_new.jpg" alt="Entre Linhas Logo" className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-white" />
                                <span className="font-brand text-3xl text-pink-600">Entre Linhas</span>
                            </div>
                            <p className="text-gray-500 text-sm">Papelaria afetiva feita para organizar sua rotina e celebrar seus momentos.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Produtos</h4>
                            <ul className="space-y-2 text-gray-500 text-sm">
                                <li><a href="#" className="hover:text-pink-500">Agendas</a></li>
                                <li><a href="#" className="hover:text-pink-500">Planners</a></li>
                                <li><a href="#" className="hover:text-pink-500">Cadernos</a></li>
                                <li><a href="#" className="hover:text-pink-500">Kits de Festa</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Ajuda</h4>
                            <ul className="space-y-2 text-gray-500 text-sm">
                                <li><a href="#" className="hover:text-pink-500">Rastrear Pedido</a></li>
                                <li><a href="#" className="hover:text-pink-500">Política de Troca</a></li>
                                <li><a href="#" className="hover:text-pink-500">Prazos de Entrega</a></li>
                                <li><a href="#" className="hover:text-pink-500">Fale Conosco</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Pagamento Seguro</h4>
                            <div className="flex gap-2 mb-4 items-center opacity-70">
                                <span className="text-xs font-bold border p-1 rounded">PIX</span>
                                <span className="text-xs font-bold border p-1 rounded">VISA</span>
                                <span className="text-xs font-bold border p-1 rounded">MASTER</span>
                            </div>
                            <div className="flex gap-4 text-pink-400">
                                <Instagram className="cursor-pointer hover:text-pink-600 transition-colors" />
                                <MessageCircle className="cursor-pointer hover:text-pink-600 transition-colors" />
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-gray-400 text-sm border-t border-gray-100 pt-8">
                        © 2026 Entre Linhas Papelaria. Todos os direitos reservados.
                    </div>
                </div>
            </footer >

            {/* --- MODAL DE PERSONALIZAÇÃO --- */}
            {
                modalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up">
                            {/* Header do Modal */}
                            <div className="bg-pink-50 p-4 border-b border-pink-100 flex justify-between items-center">
                                <h3 className="font-bold text-xl text-pink-700">
                                    {selectedProduct?.category === 'festa' ? 'Orçamento de Festa' : 'Personalize seu Pedido'}
                                </h3>
                                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-pink-100 rounded-full text-pink-500">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Conteúdo do Modal */}
                            <div className="p-6">
                                {/* Steps Indicator */}
                                <div className="flex justify-between mb-8 px-4">
                                    {[1, 2, 3].map(s => (
                                        <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            {s}
                                        </div>
                                    ))}
                                </div>

                                {/* Step 1: Produto */}
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <h4 className="text-xl font-bold">1. Escolha o Produto</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Agendas */}
                                            <div
                                                onClick={() => setSelectedProduct({ id: 'agenda', name: 'Agenda 2026', price: '', category: 'agenda', image: '/agenda_real.jpg' })}
                                                className={`group border-2 rounded-xl cursor-pointer transition-all overflow-hidden ${selectedProduct?.category === 'agenda' ? 'border-pink-500 bg-pink-50 shadow-lg' : 'border-gray-200 hover:border-pink-300 hover:shadow-md'}`}
                                            >
                                                <div className="aspect-square w-full bg-gradient-to-br from-pink-50 to-white p-4 flex items-center justify-center">
                                                    <img src="/agenda_real.jpg" className="max-w-full max-h-full object-contain drop-shadow-md" alt="Agenda" />
                                                </div>
                                                <div className="p-3 bg-white border-t border-pink-100">
                                                    <div className="font-bold text-base text-center text-gray-800">Agenda</div>
                                                    <div className="text-pink-500 text-xs font-bold text-center mt-1">Orçamento</div>
                                                </div>
                                            </div>

                                            {/* Cadernos */}
                                            <div
                                                onClick={() => setSelectedProduct({ id: 'caderno', name: 'Caderno Escolar', price: '', category: 'caderno', image: '/hero_spider.jpg' })}
                                                className={`group border-2 rounded-xl cursor-pointer transition-all overflow-hidden ${selectedProduct?.category === 'caderno' ? 'border-pink-500 bg-pink-50 shadow-lg' : 'border-gray-200 hover:border-pink-300 hover:shadow-md'}`}
                                            >
                                                <div className="aspect-square w-full bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
                                                    <img src="/hero_spider.jpg" className="max-w-full max-h-full object-contain drop-shadow-md" alt="Caderno" />
                                                </div>
                                                <div className="p-3 bg-white border-t border-pink-100">
                                                    <div className="font-bold text-base text-center text-gray-800">Cadernos</div>
                                                    <div className="text-pink-500 text-xs font-bold text-center mt-1">Orçamento</div>
                                                </div>
                                            </div>

                                            {/* Kits Personalizados */}
                                            <div
                                                onClick={() => setSelectedProduct({ id: 'festa', name: 'Kit Festa Personalizado', price: '', category: 'festa', image: '/festa_1.jpg' })}
                                                className={`col-span-2 group border-2 rounded-xl cursor-pointer transition-all overflow-hidden ${selectedProduct?.category === 'festa' ? 'border-pink-500 bg-pink-50 shadow-lg' : 'border-gray-200 hover:border-pink-300 hover:shadow-md'}`}
                                            >
                                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-white">
                                                    <div className="w-24 h-24 flex-shrink-0 bg-white rounded-lg p-2 shadow-sm">
                                                        <img src="/festa_1.jpg" className="w-full h-full object-cover rounded" alt="Kits" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-lg text-gray-800">Kits Personalizados</div>
                                                        <div className="text-pink-500 text-xs font-bold mt-1">Sob Medida</div>
                                                    </div>
                                                    <Gift size={32} className="text-pink-400 flex-shrink-0" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Detalhes */}
                                {step === 2 && (
                                    <div className="space-y-4">
                                        <h4 className="text-xl font-bold">2. Detalhes do {selectedProduct?.category === 'festa' ? 'Evento' : 'Pedido'}</h4>

                                        {selectedProduct?.category === 'festa' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tema da Festa</label>
                                                    <input
                                                        type="text"
                                                        value={partyTheme}
                                                        onChange={(e) => setPartyTheme(e.target.value)}
                                                        placeholder="Ex: Safari, Princesas, Boteco..."
                                                        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-pink-500"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome Aniversariante</label>
                                                        <input
                                                            type="text"
                                                            value={customName}
                                                            onChange={(e) => setCustomName(e.target.value)}
                                                            placeholder="Ex: Miguel"
                                                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-pink-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-1">Idade a completar</label>
                                                        <input
                                                            type="text"
                                                            value={partyAge}
                                                            onChange={(e) => setPartyAge(e.target.value)}
                                                            placeholder="Ex: 5 anos"
                                                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-pink-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Data da Festa</label>
                                                    <input
                                                        type="date"
                                                        value={partyDate}
                                                        onChange={(e) => setPartyDate(e.target.value)}
                                                        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-pink-500"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {selectedProduct?.category === 'agenda' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tema da Agenda</label>
                                                    <input
                                                        type="text"
                                                        value={themePreference}
                                                        onChange={(e) => setThemePreference(e.target.value)}
                                                        placeholder="Ex: Floral, Minimalista, Logo da Empresa..."
                                                        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-pink-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nome na Capa</label>
                                                    <input
                                                        type="text"
                                                        value={customName}
                                                        onChange={(e) => setCustomName(e.target.value)}
                                                        placeholder="Ex: Dra. Ana Silva"
                                                        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-pink-500"
                                                    />
                                                </div>
                                                <div className="bg-pink-50 p-3 rounded-xl">
                                                    <label className="block text-xs font-bold text-pink-700 uppercase mb-1">Ano</label>
                                                    <div className="font-bold text-gray-800">2026 - Edição Completa</div>
                                                </div>
                                            </>
                                        )}

                                        {selectedProduct?.category === 'caderno' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tema do Caderno</label>
                                                    <input
                                                        type="text"
                                                        value={themePreference}
                                                        onChange={(e) => setThemePreference(e.target.value)}
                                                        placeholder="Ex: Homem-Aranha, Unicórnio, Futebol..."
                                                        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-pink-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Aluno</label>
                                                    <input
                                                        type="text"
                                                        value={customName}
                                                        onChange={(e) => setCustomName(e.target.value)}
                                                        placeholder="Ex: João Pedro"
                                                        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-pink-500"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-1">Série / Turma</label>
                                                        <input
                                                            type="text"
                                                            value={schoolGrade}
                                                            onChange={(e) => setSchoolGrade(e.target.value)}
                                                            placeholder="Ex: 5º Ano B"
                                                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-pink-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-1">Matéria (Opcional)</label>
                                                        <input
                                                            type="text"
                                                            value={schoolSubject}
                                                            onChange={(e) => setSchoolSubject(e.target.value)}
                                                            placeholder="Ex: Matemática"
                                                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-pink-500"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Step 3: Revisão */}
                                {step === 3 && (
                                    <div className="space-y-4 text-center">
                                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle size={32} />
                                        </div>
                                        <h4 className="text-xl font-bold">Tudo Pronto!</h4>
                                        <p className="text-gray-500">
                                            {selectedProduct?.category === 'festa'
                                                ? 'Seu orçamento prévio está pronto. Vamos finalizar os detalhes no WhatsApp?'
                                                : 'Seu pedido está pronto para ser enviado para nossa equipe no WhatsApp.'}
                                        </p>

                                        <div className="bg-gray-50 p-4 rounded-xl text-left text-sm space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Produto:</span>
                                                <span className="font-bold">{selectedProduct?.name}</span>
                                            </div>
                                            {selectedProduct?.category === 'festa' && (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Tema:</span>
                                                        <span className="font-bold">{partyTheme || '-'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Aniversariante:</span>
                                                        <span className="font-bold">{customName || '-'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Data:</span>
                                                        <span className="font-bold">{partyDate || '-'}</span>
                                                    </div>
                                                </>
                                            )}
                                            {selectedProduct?.category === 'agenda' && (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Tema:</span>
                                                        <span className="font-bold">{themePreference || '-'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Nome Capa:</span>
                                                        <span className="font-bold">{customName || '-'}</span>
                                                    </div>
                                                </>
                                            )}
                                            {selectedProduct?.category === 'caderno' && (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Tema:</span>
                                                        <span className="font-bold">{themePreference || '-'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Aluno:</span>
                                                        <span className="font-bold">{customName || '-'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Turma:</span>
                                                        <span className="font-bold">{schoolGrade || '-'}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Footer do Modal */}
                            <div className="p-4 border-t border-gray-100 flex justify-between">
                                {step > 1 ? (
                                    <button onClick={handlePrevStep} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">
                                        Voltar
                                    </button>
                                ) : (
                                    <div></div>
                                )}

                                {step < 3 ? (
                                    <button
                                        onClick={handleNextStep}
                                        disabled={!canProceedToNextStep()}
                                        className={`px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all ${!canProceedToNextStep() ? 'bg-gray-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'}`}
                                    >
                                        Próximo <ChevronRight size={18} />
                                    </button>
                                ) : (
                                    <button onClick={handleFinish} className="px-8 py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 flex items-center gap-2">
                                        Finalizar no WhatsApp <MessageCircle size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Toast de Feedback */}
            {showToast && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-8 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
                >
                    <CheckCircle size={24} />
                    <div>
                        <div className="font-bold">Redirecionando para WhatsApp!</div>
                        <div className="text-sm opacity-90">Aguarde um momento...</div>
                    </div>
                </motion.div>
            )}

            {/* Bot\u00e3o Voltar ao Topo */}
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-40 bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110"
                    aria-label="Voltar ao topo"
                >
                    <ChevronRight size={24} className="rotate-[-90deg]" />
                </motion.button>
            )}
        </div >
    );
};

export default LandingPage;
