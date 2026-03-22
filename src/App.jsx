import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// Your custom cat images - use BASE_URL for GitHub Pages compatibility
const BASE = import.meta.env.BASE_URL || '/';
const CAT_TULIPS = `${BASE}cats/cat-flowers.png`;
const CAT_SHY = `${BASE}cats/cat-shy.png`;
const CAT_KITTEN = `${BASE}cats/cat-kitten.png`;
const CAT_ANGRY = `${BASE}cats/cat-angry.png`;
const CAT_KNIFE = `${BASE}cats/cat-knife.png`;

// Typewriter effect hook
const useTypewriter = (text, speed = 50, startDelay = 0, trigger = true) => {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!trigger) return;

        setDisplayText('');
        setIsComplete(false);

        const startTimeout = setTimeout(() => {
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    setDisplayText(text.slice(0, i + 1));
                    i++;
                } else {
                    setIsComplete(true);
                    clearInterval(timer);
                }
            }, speed);

            return () => clearInterval(timer);
        }, startDelay);

        return () => clearTimeout(startTimeout);
    }, [text, speed, startDelay, trigger]);

    return { displayText, isComplete };
};

// Sparkle particle component
const Sparkles = () => {
    return (
        <div className="sparkles">
            {[...Array(30)].map((_, i) => (
                <span
                    key={i}
                    className="sparkle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${1.5 + Math.random() * 2}s`,
                    }}
                />
            ))}
        </div>
    );
};

// Floating petals component
const FloatingPetals = () => {
    const petals = ['🌸', '💮', '🎀', '💗', '✨', '🌷', '💕', '🩷'];
    return (
        <div className="floating-petals">
            {[...Array(25)].map((_, i) => (
                <span
                    key={i}
                    className="petal"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 10}s`,
                        animationDuration: `${8 + Math.random() * 8}s`,
                        fontSize: `${1 + Math.random() * 1.5}rem`,
                        opacity: 0.5 + Math.random() * 0.5
                    }}
                >
                    {petals[Math.floor(Math.random() * petals.length)]}
                </span>
            ))}
        </div>
    );
};

function App() {
    const [scene, setScene] = useState('intro');
    const [showCat, setShowCat] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [noCount, setNoCount] = useState(0);
    const [yesScale, setYesScale] = useState(1);
    const [noScale, setNoScale] = useState(1);

    const introText = useTypewriter("hey cutie... 💕", 100, 800);
    const askText = useTypewriter(
        scene === 'ask' ? "Mati vaat nhi kare? 🥺👉👈" : "",
        70,
        1000
    );
    const moreText = useTypewriter(
        scene === 'thankyou' ? "but wait... Thare vste kuch haa 💌" : "",
        60,
        500,
        scene === 'thankyou'
    );

    useEffect(() => {
        if (scene === 'intro' && introText.isComplete) {
            const timer = setTimeout(() => setScene('ask'), 2000);
            return () => clearTimeout(timer);
        }
    }, [scene, introText.isComplete]);

    useEffect(() => {
        if (scene === 'ask') {
            setShowCat(false);
            const catTimer = setTimeout(() => setShowCat(true), 400);
            const btnTimer = setTimeout(() => setShowButtons(true), 2500);
            return () => {
                clearTimeout(catTimer);
                clearTimeout(btnTimer);
            };
        }
    }, [scene]);

    // Auto transition from yes to thankyou
    useEffect(() => {
        if (scene === 'yes') {
            const timer = setTimeout(() => setScene('thankyou'), 3500);
            return () => clearTimeout(timer);
        }
    }, [scene]);

    // Auto transition from thankyou to envelope
    useEffect(() => {
        if (scene === 'thankyou' && moreText.isComplete) {
            const timer = setTimeout(() => setScene('envelope'), 1500);
            return () => clearTimeout(timer);
        }
    }, [scene, moreText.isComplete]);

    const handleNo = () => {
        setNoCount(noCount + 1);
        setYesScale(prev => Math.min(prev + 0.25, 2.5));
        setNoScale(prev => Math.max(prev - 0.1, 0.5));

        if (noCount >= 2) {
            setScene('no');
            setTimeout(() => setScene('knife'), 2500);
        }
    };

    const handleGoBack = () => {
        setScene('ask');
        setShowButtons(false);
        setShowCat(false);
        setNoCount(0);
        setYesScale(1);
        setNoScale(1);
        setTimeout(() => setShowCat(true), 400);
        setTimeout(() => setShowButtons(true), 1000);
    };

    const handleYes = () => {
        setScene('yes');

        const colors = ['#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb', '#db7093', '#ff85a2'];

        confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.5, x: 0.5 },
            colors
        });

        setTimeout(() => {
            confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors });
            confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors });
        }, 300);

        const duration = 4000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors });
            confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    };

    const handleOpenLetter = () => {
        setScene('letter');
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff69b4', '#ff1493', '#ffb6c1']
        });
    };

    const noMessages = ["no 💔", "are you sure? 🥺", "please? 😿", "pretty please? 🙏"];

    return (
        <div className="app">
            <FloatingPetals />
            <Sparkles />

            {/* INTRO SCENE */}
            {scene === 'intro' && (
                <div className="scene intro-scene">
                    <div className="cat-peek-top">
                        <img src={CAT_SHY} alt="Shy cat peeking" />
                    </div>
                    <div className="intro-content">
                        <h1 className="typewriter-text glow-text">
                            {introText.displayText}
                            <span className="cursor">|</span>
                        </h1>
                    </div>
                </div>
            )}

            {/* ASK SCENE */}
            {scene === 'ask' && (
                <div className="scene ask-scene">
                    <div className={`cat-slide-left ${showCat ? 'visible' : ''}`}>
                        <img src={CAT_TULIPS} alt="Cat with tulips" />
                    </div>

                    <div className="ask-content">
                        <h1 className="typewriter-text glow-text">
                            {askText.displayText}
                            {!askText.isComplete && <span className="cursor">|</span>}
                        </h1>

                        {showButtons && (
                            <div className="buttons-container fade-in-up">
                                <button
                                    className="btn-yes glow-pulse"
                                    onClick={handleYes}
                                    style={{ transform: `scale(${yesScale})` }}
                                >
                                    YES! 💖
                                </button>
                                <button
                                    className="btn-no wiggle-hover"
                                    onClick={handleNo}
                                    style={{ transform: `scale(${noScale})` }}
                                >
                                    {noMessages[Math.min(noCount, noMessages.length - 1)]}
                                </button>
                            </div>
                        )}

                        {noCount > 0 && showButtons && (
                            <p className="hint-text fade-in">
                                {noCount === 1 && "hmm the yes button seems bigger... 👀"}
                                {noCount === 2 && "last chance... 😳"}
                                {noCount >= 3 && "okay you asked for it 😤"}
                            </p>
                        )}
                    </div>

                    <div className={`cat-slide-right ${showCat ? 'visible' : ''}`}>
                        <img src={CAT_KITTEN} alt="Cute kitten" />
                    </div>
                </div>
            )}

            {/* NO SCENE */}
            {scene === 'no' && (
                <div className="scene no-scene">
                    <div className="cat-drop-top">
                        <img src={CAT_ANGRY} alt="Angry cat" />
                    </div>
                    <h1 className="angry-text shake">did you just say NO?!</h1>
                    <p className="angry-sub pulse-text">😤 wrong answer...</p>
                </div>
            )}

            {/* KNIFE SCENE */}
            {scene === 'knife' && (
                <div className="scene knife-scene">
                    <div className="cat-zoom-in">
                        <img src={CAT_KNIFE} alt="Cat with knife" />
                    </div>
                    <h1 className="threat-text">try again. 🔪</h1>
                    <button className="btn-goback pulse-danger" onClick={handleGoBack}>
                        OKAY OKAY I'LL GO BACK 😰
                    </button>
                </div>
            )}

            {/* YES SCENE - Celebration */}
            {scene === 'yes' && (
                <div className="scene yes-scene">
                    <div className="celebration-cats">
                        <div className="cat-spin-left">
                            <img src={CAT_TULIPS} alt="Cat celebrating" />
                        </div>
                        <div className="cat-bounce-center">
                            <img src={CAT_KITTEN} alt="Happy kitten" />
                        </div>
                        <div className="cat-spin-right">
                            <img src={CAT_SHY} alt="Shy cat happy" />
                        </div>
                    </div>

                    <h1 className="celebration-text">
                        <span className="rainbow-shimmer">YAYYYY!!!</span>
                    </h1>
                    <p className="love-message fade-in-up">
                        Mn Tha Tu ke Tu ha boli 😽💕
                    </p>
                    <div className="heart-burst">
                        {['💖', '💗', '💓', '💕', '💝', '🌹', '✨', '💖', '💗', '💓'].map((h, i) => (
                            <span key={i} className="burst-heart" style={{ animationDelay: `${i * 0.08}s` }}>
                                {h}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* THANK YOU / THERE'S MORE SCENE */}
            {scene === 'thankyou' && (
                <div className="scene thankyou-scene">
                    <h1 className="typewriter-text glow-text">
                        {moreText.displayText}
                        {!moreText.isComplete && <span className="cursor">|</span>}
                    </h1>
                </div>
            )}

            {/* ENVELOPE SCENE - Full screen centered */}
            {scene === 'envelope' && (
                <div className="scene envelope-scene">
                    <div className="envelope" onClick={handleOpenLetter}>
                        <div className="envelope-flap"></div>
                        <div className="envelope-body">
                            <span className="envelope-heart">💌</span>
                        </div>
                    </div>
                    <p className="tap-text">tap to open</p>
                </div>
            )}

            {/* LETTER SCENE */}
            {scene === 'letter' && (
                <div className="scene letter-scene">
                    <div className="letter-container">
                        <div className="letter">
                            <div className="letter-header">
                                <span className="letter-emoji">💌</span>
                                <h2>A Letter For You</h2>
                                <span className="letter-emoji">💌</span>
                            </div>

                            <div className="letter-content">
                                <p className="letter-greeting">My Dearest Love,</p>

                                <p className="letter-body">
                                    We both know ki glti toh thari haa but mei hosiu ki chalo hamke wait pu kara kaa tha tu aaven 
                                    mn sorry boli butttt naa tu sorry kikn pu bole jab tak mu hu 😾🫶🏻

                                </p>

                                <p className="letter-body">
                                    Im sorry ji i forgot to use my brain that day😿 mu thodo pagal hu thare
                                    pyaar mei.. jako aap mn maaf kro kuki mu tha vagar 1sec bhi nhi reh hkto 😾
                                </p>

                                <p className="letter-body">
                                    Lob u baby 😽🥳🫂
                                </p>

                                <p className="letter-closing">
                                    
                                </p>
                                <p className="letter-signature">
                                    With All My Love 💖
                                </p>
                            </div>

                            <div className="letter-footer">
                                <span>🌹</span>
                                <span>✨</span>
                                <span>💝</span>
                                <span>✨</span>
                                <span>🌹</span>
                            </div>
                        </div>
                    </div>

                    <div className="letter-cats">
                        <img src={CAT_TULIPS} alt="Cat" className="letter-cat-left" />
                        <img src={CAT_KITTEN} alt="Cat" className="letter-cat-right" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
