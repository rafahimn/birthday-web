import { SiteConfig } from "@/types/site-config";

function esc(s: string) {
  return (s || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function generateSiteHtml(config: SiteConfig): string {
  const c = config;

  const photosHtml = c.photos
    .map(
      (p) => `
      <div class="photo-card" onclick="openLightbox('${p.url}')">
        <img src="${p.url}" alt="${esc(p.title)}" class="photo-img">
        <div class="photo-date">${esc(p.title)}</div>
        <div class="photo-caption">${esc(p.caption)}</div>
      </div>`
    )
    .join("\n");

  const videosHtml = c.videos
    .map(
      (v) => `
      <div class="video-card">
        <h3>${esc(v.title)}</h3>
        <div class="video-wrapper">
          <video controls ${v.poster ? `poster="${v.poster}"` : ""}>
            <source src="${v.url}" type="video/mp4">
          </video>
        </div>
      </div>`
    )
    .join("\n");

  const letterHtml = c.letterParagraphs.map((p) => `<p>${esc(p)}</p>`).join("\n");

  const reasonsJs = JSON.stringify(c.reasons);
  const configJs = JSON.stringify({
    month: c.month,
    day: c.day,
    hour: c.hour,
    minute: c.minute,
    age: c.age,
    name: c.recipientName
  });

  return `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
    <meta property="og:title" content="${esc(c.pageTitle)}">
    <meta property="og:type" content="website">
    <title>${esc(c.pageTitle)}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Comic+Neue:wght@700&family=Dancing+Script:wght@700&family=Quicksand:wght@300;400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <style>
        :root {
          --primary: ${c.primaryColor};
          --secondary: ${c.secondaryColor};
          --accent: ${c.accentColor};
        }
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Quicksand',sans-serif; overflow-x:hidden; color:#4a4a4a; min-height:100vh; }
        .video-bg { position:fixed; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:-2; filter:brightness(0.8); animation:slowZoom 20s infinite alternate; }
        @keyframes slowZoom { from{ transform:scale(1); } to{ transform:scale(1.05); } }
        .overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:linear-gradient(135deg, rgba(255,192,203,0.3), rgba(147,112,219,0.3)); z-index:-1; }
        .floating-elements { position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:5; overflow:hidden; }
        .float-item { position:absolute; font-size:2rem; opacity:0.5; animation:simpleFloat 12s infinite ease-in-out; filter:drop-shadow(0 0 5px rgba(255,255,255,0.5)); }
        @keyframes simpleFloat { 0%{ transform:translate(0,100vh) rotate(0deg); opacity:0; } 20%{ opacity:0.8; transform:translate(15vw,80vh) rotate(15deg); } 50%{ transform:translate(40vw,50vh) rotate(30deg); } 80%{ opacity:0.8; transform:translate(70vw,20vh) rotate(15deg); } 100%{ transform:translate(90vw,-10vh) rotate(0deg); opacity:0; } }
        .custom-cursor { width:30px; height:30px; position:fixed; pointer-events:none; z-index:9999; mix-blend-mode:difference; transition:transform 0.1s; }
        .custom-cursor svg { width:100%; height:100%; filter:drop-shadow(0 0 5px rgba(255,182,193,0.5)); }
        .floating-hearts { position:fixed; width:100%; height:100%; pointer-events:none; z-index:2; }
        .heart-float { position:absolute; font-size:1.5rem; color:rgba(255,105,180,0.6); animation:floatHeart var(--float-duration,6s) ease-in-out infinite; animation-delay:var(--delay,0s); }
        @keyframes floatHeart { 0%{ transform:translate(0,100vh) rotate(0deg); } 100%{ transform:translate(var(--translate-x,0), -100vh) rotate(360deg); } }
        .magic-sparkles { position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1; }
        .magic-sparkles::before, .magic-sparkles::after { content:''; position:absolute; width:100%; height:100%; background-image:radial-gradient(circle, white 1px, transparent 1px); background-size:50px 50px; animation:sparkleLayer 8s linear infinite; opacity:0.5; }
        .magic-sparkles::after { animation-delay:-4s; transform:rotate(45deg); }
        @keyframes sparkleLayer { 0%{ transform:translateY(0); } 100%{ transform:translateY(-50px); } }
        .contact-float-btn { position:fixed; bottom:20px; right:20px; z-index:9999; }
        .contact-float-btn button { background:linear-gradient(135deg,var(--secondary),#fbc2eb); color:#4a4a4a; border:none; width:45px; height:45px; border-radius:50%; font-size:20px; cursor:pointer; box-shadow:0 5px 20px rgba(147,112,219,0.4); border:2px solid rgba(255,255,255,0.8); transition:0.3s; display:flex; align-items:center; justify-content:center; }
        .contact-float-btn button:hover { transform:scale(1.15); box-shadow:0 0 30px var(--secondary); }
        .play-float-btn { position:fixed; bottom:20px; right:90px; z-index:9999; }
        .play-float-btn button { background:linear-gradient(135deg,var(--primary),#fad0c4); color:#4a4a4a; border:none; width:45px; height:45px; border-radius:50%; font-size:20px; cursor:pointer; box-shadow:0 5px 20px rgba(255,105,180,0.4); border:2px solid rgba(255,255,255,0.8); transition:0.3s; display:flex; align-items:center; justify-content:center; animation:softPulse 2s infinite; }
        .play-float-btn button:hover { transform:scale(1.15); box-shadow:0 0 30px var(--primary); }
        .play-float-btn.hide { display:none; }
        @keyframes softPulse { 0%,100%{ transform:scale(1); opacity:1; } 50%{ transform:scale(1.1); opacity:0.9; } }
        .countdown-screen { position:fixed; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; background:linear-gradient(135deg, rgba(255,209,220,0.4), rgba(230,230,250,0.4)); backdrop-filter:blur(8px); z-index:1000; transition:1s; text-align:center; padding:20px; }
        .countdown-screen.hide { opacity:0; visibility:hidden; }
        .countdown-title { font-size:clamp(24px,5vw,40px); color:#fff; margin-bottom:20px; text-shadow:2px 2px 8px rgba(0,0,0,0.3); font-weight:600; }
        .countdown-box { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-bottom:20px; }
        .count-item { background:rgba(255,255,255,0.3); padding:12px 15px; border-radius:20px; min-width:70px; border:1px solid rgba(255,255,255,0.4); backdrop-filter:blur(5px); }
        .count-number { font-size:clamp(28px,6vw,40px); font-weight:800; color:#fff; display:block; text-shadow:2px 2px 8px rgba(0,0,0,0.3); }
        .count-label { font-size:12px; color:rgba(255,255,255,0.95); letter-spacing:1px; }
        .countdown-message { font-size:clamp(16px,4vw,24px); color:#fff; margin-top:20px; text-shadow:2px 2px 8px rgba(0,0,0,0.3); }
        .greeting-screen { position:fixed; top:0; left:0; width:100%; height:100%; display:none; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(-45deg,#fee9f7,#e8f5fe,#fef2e8,#f0ffe8); background-size:400% 400%; animation:gradientBG 15s ease infinite; z-index:900; padding:20px; text-align:center; }
        .greeting-screen.show { display:flex; }
        @keyframes gradientBG { 0%{ background-position:0% 50%; } 50%{ background-position:100% 50%; } 100%{ background-position:0% 50%; } }
        .greeting-screen h1 { font-family:'Bubblegum Sans',cursive; font-size:clamp(2.2rem,10vw,4.5rem); color:#d4145a; text-shadow:2px 2px 8px rgba(255,255,255,0.8); margin-bottom:2rem; animation:bounce 1s ease infinite; }
        @keyframes bounce { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-10px); } }
        .greeting-text { font-size:1.5rem; color:#4b0082; margin-bottom:3rem; min-height:2em; font-weight:600; }
        .enter-btn { padding:1rem 2rem; font-size:1.2rem; background:linear-gradient(45deg,var(--primary),#ff99cc); border:none; border-radius:50px; color:white; cursor:pointer; box-shadow:0 0 15px rgba(255,105,180,0.5); transition:transform 0.3s; font-weight:700; }
        .enter-btn:hover { transform:scale(1.1); }
        .cake-screen { position:fixed; top:0; left:0; width:100%; height:100%; display:none; flex-direction:column; align-items:center; justify-content:center; background:rgba(255,255,255,0.2); backdrop-filter:blur(10px); z-index:800; padding:20px; text-align:center; }
        .cake-screen.show { display:flex; }
        .cake-container { background:rgba(255,255,255,0.15); backdrop-filter:blur(10px); padding:30px 20px; border-radius:40px; border:1px solid rgba(255,255,255,0.3); max-width:500px; width:100%; box-shadow:0 15px 35px rgba(0,0,0,0.2); }
        .cake-emoji { font-size:clamp(80px,18vw,110px); text-align:center; animation:softBounce 2s infinite; }
        @keyframes softBounce { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-10px); } }
        .candles { display:flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:8px; margin:20px 0; min-height:80px; }
        .candle { cursor:pointer; transition:0.2s; animation:flicker 0.5s infinite alternate; display:inline-block; font-size:clamp(30px,8vw,42px); filter:drop-shadow(0 0 8px gold); }
        .candle.blown { opacity:0.2; filter:grayscale(1); pointer-events:none; animation:none; }
        @keyframes flicker { from{ opacity:1; transform:scale(1); } to{ opacity:0.8; transform:scale(1.1); } }
        .cake-status { font-size:clamp(16px,4vw,20px); color:white; margin:20px 0; padding:12px; border-radius:40px; background:rgba(0,0,0,0.5); }
        .cut-btn { background:linear-gradient(45deg,var(--accent),red); color:black; font-size:clamp(20px,5vw,24px); padding:12px 25px; border:none; border-radius:40px; font-weight:bold; cursor:pointer; transition:0.3s; border:2px solid white; width:100%; box-shadow:0 8px 15px rgba(0,0,0,0.3); }
        .cut-btn:disabled { opacity:0.3; cursor:not-allowed; }
        .cut-btn:not(:disabled):hover { transform:scale(1.05); box-shadow:0 0 25px var(--accent); }
        .cake-next-btn { margin-top:20px; padding:12px 30px; background:linear-gradient(45deg,var(--secondary),#ff6dc7); border:none; border-radius:50px; color:white; font-size:1.2rem; cursor:pointer; font-weight:bold; box-shadow:0 5px 15px rgba(155,109,255,0.4); transition:0.3s; border:2px solid white; }
        .cake-next-btn:hover { transform:scale(1.1); }
        .reasons-screen { position:fixed; top:0; left:0; width:100%; height:100%; display:none; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(-45deg,#ffe6e6,#e6e6ff,#ffebf5); background-size:400% 400%; animation:gradientBG 15s ease infinite; z-index:750; padding:20px; }
        .reasons-screen.show { display:flex; }
        .reasons-header h1 { font-family:'Bubblegum Sans',cursive; font-size:clamp(2.2rem,8vw,3.5rem); color:var(--primary); margin-bottom:2rem; animation:bounce 1s ease infinite; text-align:center; }
        .reasons-container { width:100%; max-width:1000px; margin:0 auto; min-height:300px; display:flex; justify-content:center; align-items:center; }
        .reason-card { background:rgba(255,255,255,0.95); border-radius:20px; padding:2rem; box-shadow:0 10px 30px rgba(0,0,0,0.15); text-align:center; max-width:950px; width:100%; transition:transform 0.3s; cursor:pointer; position:relative; overflow:hidden; }
        .reason-card:hover { transform:translateY(-5px); }
        .reason-text { font-size:1.2rem; line-height:1.4; color:#4a4a4a; margin-bottom:1rem; font-weight:500; }
        .reason-emoji { font-size:2.5rem; }
        .gif-overlay { position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.85); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.3s; z-index:10; }
        .reason-card:hover .gif-overlay { opacity:1; }
        .gif-overlay img { max-width:80%; max-height:80%; border-radius:10px; }
        .reason-counter { font-size:1rem; color:var(--primary); margin:20px 0 15px; font-weight:600; opacity:0.8; }
        .reasons-btn { background:linear-gradient(45deg,var(--primary),#ff99cc); border:none; border-radius:50px; padding:1rem 2rem; font-size:1.2rem; color:white; cursor:pointer; transition:all 0.3s; box-shadow:0 5px 15px rgba(255,105,180,0.3); min-width:200px; font-weight:700; }
        .reasons-btn:hover { transform:scale(1.1); }
        .reasons-btn.story-mode { background:linear-gradient(45deg,var(--secondary),#ff6dc7); transform:scale(1.1); animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100%{ transform:scale(1.1); } 50%{ transform:scale(1.2); } }
        .photo-screen { position:fixed; top:0; left:0; width:100%; height:100%; display:none; flex-direction:column; align-items:center; overflow-y:auto; background:linear-gradient(135deg,#ffd1dc 0%,#e6e6fa 25%,#ffefd5 50%,#e6e6fa 75%,#ffd1dc 100%); background-size:400% 400%; animation:gradientFlow 15s ease infinite; z-index:700; padding:80px 20px 40px; }
        .photo-screen.show { display:block; }
        @keyframes gradientFlow { 0%{ background-position:0% 50%; } 50%{ background-position:100% 50%; } 100%{ background-position:0% 50%; } }
        .photo-header h1 { font-family:'Dancing Script',cursive; font-size:3rem; color:#b0306e; margin-bottom:1rem; text-align:center; }
        .photo-header p { font-size:1.2rem; max-width:600px; margin:0 auto 2rem; line-height:1.6; color:#2c3e50; font-weight:600; text-align:center; }
        .photo-container { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fit, minmax(300px,1fr)); gap:2rem; }
        .photo-card { background:rgba(255,255,255,0.9); border-radius:20px; padding:1.5rem; box-shadow:0 10px 20px rgba(0,0,0,0.1); transition:all 0.5s; cursor:pointer; overflow:hidden; }
        .photo-card:hover { transform:translateY(-10px) scale(1.02); }
        .photo-img { width:100%; height:250px; object-fit:cover; border-radius:15px; margin-bottom:1rem; }
        .photo-date { font-family:'Dancing Script',cursive; color:#c71585; font-size:1.3rem; margin-bottom:0.5rem; font-weight:700; }
        .photo-caption { font-size:1rem; line-height:1.5; color:#2c3e50; font-weight:500; }
        .photo-next-btn { display:block; margin:30px auto; padding:12px 30px; background:linear-gradient(45deg,var(--secondary),#ff6dc7); border:none; border-radius:50px; color:white; font-size:1.2rem; cursor:pointer; font-weight:bold; }
        .video-screen { position:fixed; top:0; left:0; width:100%; height:100%; display:none; flex-direction:column; align-items:center; overflow-y:auto; background:linear-gradient(135deg,#a8edea 0%,#fed6e3 100%); z-index:600; padding:60px 20px 40px; }
        .video-screen.show { display:flex; }
        .video-screen h2 { font-family:'Dancing Script',cursive; font-size:2.5rem; color:#b0306e; margin-bottom:2rem; text-align:center; }
        .video-container { max-width:1200px; width:100%; margin:0 auto; }
        .video-grid { display:grid; grid-template-columns:1fr; gap:30px; }
        @media (min-width:768px) { .video-grid { grid-template-columns:repeat(2,1fr); } }
        .video-card { background:rgba(255,255,255,0.2); backdrop-filter:blur(10px); border-radius:20px; padding:20px; border:2px solid rgba(255,255,255,0.3); }
        .video-card h3 { font-size:1.3rem; color:#d4145a; margin-bottom:15px; text-align:center; }
        .video-wrapper { position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:15px; }
        .video-wrapper video { position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; }
        .video-next-btn { display:block; margin:40px auto 20px; padding:12px 30px; background:linear-gradient(45deg,var(--primary),#ff99cc); border:none; border-radius:50px; color:white; font-size:1.2rem; cursor:pointer; font-weight:bold; }
        .letter-screen { position:fixed; top:0; left:0; width:100%; height:100%; display:none; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg,#fdfbfb 0%,#ebedee 100%); z-index:500; padding:20px; }
        .letter-screen.show { display:flex; }
        .letter-container { max-width:600px; background:rgba(255,255,255,0.9); padding:2rem; border-radius:30px; box-shadow:0 10px 30px rgba(0,0,0,0.1); text-align:center; }
        .letter-container h2 { font-family:'Dancing Script',cursive; font-size:2.5rem; color:#b0306e; margin-bottom:1rem; }
        .letter-content { font-size:1.2rem; line-height:1.8; color:#2c3e50; font-weight:500; }
        .letter-content p { margin-bottom: 0.8rem; }
        .letter-return-btn { margin-top:20px; padding:12px 30px; background:linear-gradient(45deg,var(--primary),#ff99cc); border:none; border-radius:50px; color:white; font-size:1.2rem; cursor:pointer; font-weight:bold; }
        .secret-screen { position:fixed; top:0; left:0; width:100%; height:100%; display:none; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg,#ffe6f0,#ffe0f0); z-index:550; padding:20px; }
        .secret-screen.show { display:flex; }
        .secret-container { max-width:600px; width:100%; background:rgba(255,255,255,0.85); backdrop-filter:blur(12px); padding:2rem; border-radius:40px; box-shadow:0 20px 40px rgba(0,0,0,0.3); text-align:center; border:2px solid white; }
        .secret-photo { width:100%; max-height:400px; object-fit:cover; border-radius:30px; box-shadow:0 15px 30px rgba(0,0,0,0.3); cursor:pointer; border:3px solid white; }
        .soulmate-btn { margin-top:30px; padding:12px 30px; background:linear-gradient(45deg,var(--secondary),#ff6dc7); border:none; border-radius:50px; color:white; font-size:1.2rem; cursor:pointer; font-weight:bold; text-decoration:none; display:inline-block; }
        .lightbox { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:10001; justify-content:center; align-items:center; padding:20px; }
        .lightbox.show { display:flex; }
        .lightbox img { max-width:90%; max-height:90%; border-radius:10px; border:3px solid white; }
        .lightbox .close { position:absolute; top:20px; right:30px; font-size:40px; color:white; cursor:pointer; }
        .contact-page { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:10000; display:none; justify-content:center; align-items:center; padding:15px; overflow-y:auto; }
        .contact-page.show { display:flex; }
        .contact-container { background:linear-gradient(135deg,#667eea,#764ba2); padding:30px 20px; border-radius:30px; border:3px solid var(--accent); max-width:450px; width:100%; box-shadow:0 20px 40px rgba(0,0,0,0.5); }
        .contact-container h2 { color:var(--accent); font-size:24px; margin-bottom:25px; text-align:center; }
        .form-group label { display:block; color:white; margin-bottom:5px; font-size:14px; font-weight:500; }
        .form-group input, .form-group textarea { width:100%; padding:12px 15px; border-radius:25px; border:2px solid var(--accent); background:rgba(255,255,255,0.15); color:white; font-size:14px; outline:none; margin-bottom: 10px; }
        .form-group textarea { height:100px; resize:none; }
        .submit-btn { background:var(--accent); color:black; border:none; padding:12px 30px; border-radius:30px; font-size:16px; font-weight:bold; cursor:pointer; width:100%; border:2px solid white; margin-top:5px; }
        #form-status { text-align:center; margin-top:12px; font-weight:bold; color:var(--accent); font-size:14px; }
        .social-buttons { margin-top:25px; display:flex; flex-direction:column; gap:10px; }
        .social-btn { display:flex; align-items:center; padding:12px 20px; border-radius:40px; border:2px solid var(--accent); color:white; text-decoration:none; font-size:16px; font-weight:500; background:rgba(255,255,255,0.1); }
        .social-btn i { font-size:20px; width:35px; color:var(--accent); }
        .social-btn span { flex:1; }
        .social-btn.facebook { background:linear-gradient(45deg,#1877f2,#0d5ab9); }
        .social-btn.instagram { background:linear-gradient(45deg,#f09433,#d62976,#962fbf); }
        .close-contact-btn { margin-top:25px; background:transparent; color:white; border:2px solid var(--accent); padding:10px 25px; border-radius:30px; font-size:15px; font-weight:bold; cursor:pointer; width:100%; }
        @media (max-width:768px) { .reasons-header h1 { font-size:2.2rem; } .photo-header h1 { font-size:2.2rem; } .photo-container { grid-template-columns:1fr; } .video-grid { grid-template-columns:1fr; } }
    </style>
</head>
<body>
    <div class="floating-elements" id="floatingElements"></div>

    ${c.countdownAudioUrl ? `<audio id="countdownAudio" preload="auto"><source src="${c.countdownAudioUrl}" type="audio/mpeg"></audio>` : `<audio id="countdownAudio" preload="auto"></audio>`}
    ${c.birthdayAudioUrl ? `<audio id="birthdayWish" preload="auto" loop><source src="${c.birthdayAudioUrl}" type="audio/mpeg"></audio>` : `<audio id="birthdayWish" preload="auto" loop></audio>`}

    <video class="video-bg" autoplay muted loop playsinline>
        <source src="${c.bgVideoUrl}" type="video/mp4">
    </video>
    <div class="overlay"></div>
    <div class="magic-sparkles"></div>
    <div class="floating-hearts" id="floatingHearts"></div>

    <div class="custom-cursor">
        <svg viewBox="0 0 24 24"><path fill="${c.primaryColor}" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
    </div>

    <div class="play-float-btn" id="playBtn"><button onclick="startAudio(event)"><i class="fas fa-play"></i></button></div>
    <div class="contact-float-btn"><button onclick="openContactPage()" aria-label="Contact"><i class="fas fa-comment"></i></button></div>

    <div class="lightbox" id="lightbox" onclick="closeLightbox(event)">
        <span class="close" onclick="closeLightbox(event)">&times;</span>
        <img src="" id="lightboxImg">
    </div>

    <div class="countdown-screen" id="countdownScreen">
        <h1 class="countdown-title">Wait for it... ⌛</h1>
        <div class="countdown-box">
            <div class="count-item"><span class="count-number" id="days">00</span><span class="count-label">Days</span></div>
            <div class="count-item"><span class="count-number" id="hours">00</span><span class="count-label">Hours</span></div>
            <div class="count-item"><span class="count-number" id="mins">00</span><span class="count-label">Mins</span></div>
            <div class="count-item"><span class="count-number" id="secs">00</span><span class="count-label">Secs</span></div>
        </div>
        <div class="countdown-message" id="countdownMessage"></div>
    </div>

    <div class="greeting-screen" id="greetingScreen">
        <h1>${esc(c.greetingHeading)}</h1>
        <div class="greeting-text" id="greetingText"></div>
        <button class="enter-btn" onclick="goToCakeScreen()">Click to enter your world 💕</button>
    </div>

    <div class="cake-screen" id="cakeScreen">
        <div class="cake-container">
            <div class="cake-emoji" id="cakeEmoji">🎂</div>
            <div class="candles" id="candles"></div>
            <div class="cake-status" id="cakeStatus"></div>
            <button class="cut-btn" id="cutBtn" onclick="cutCake()" disabled>🍰 Cut Cake</button>
        </div>
    </div>

    <div class="reasons-screen" id="reasonsScreen">
        <div class="reasons-header"><h1>${esc(c.reasonsHeading)}</h1></div>
        <div class="reasons-container" id="reasonsContainer"></div>
        <div class="reason-counter" id="reasonCounter">Reason 1 of ${c.reasons.length}</div>
        <button class="reasons-btn" id="reasonsBtn" onclick="handleReasonClick()">Click Here... 💕</button>
    </div>

    <div class="photo-screen" id="photoScreen">
        <div class="photo-header">
            <h1>${esc(c.photosHeading)}</h1>
            <p>${esc(c.photosSubtext)}</p>
        </div>
        <div class="photo-container">${photosHtml}</div>
        <button class="photo-next-btn" onclick="goToVideoScreen()">Continue your storyline 🎥</button>
    </div>

    <div class="video-screen" id="videoScreen">
        <h2>${esc(c.videosHeading)}</h2>
        <div class="video-container">
            <div class="video-grid">${videosHtml}</div>
            <button class="video-next-btn" onclick="goToLetterScreen()">See your letter 💌</button>
        </div>
    </div>

    <div class="letter-screen" id="letterScreen">
        <div class="letter-container">
            <h2>${esc(c.letterHeading)}</h2>
            <div class="letter-content">${letterHtml}</div>
            <button class="letter-return-btn" onclick="goToSecretScreen()">Again, Happy Birthday</button>
        </div>
    </div>

    ${c.secretPhotoUrl ? `
    <div class="secret-screen" id="secretScreen">
        <div class="secret-container">
            <img src="${c.secretPhotoUrl}" alt="Secret Memory" class="secret-photo" onclick="openLightbox('${c.secretPhotoUrl}')">
            <button class="soulmate-btn" onclick="window.open('${c.secretButtonLink}', '_blank')">${esc(c.secretButtonLabel)}</button>
        </div>
    </div>` : `<div class="secret-screen" id="secretScreen"><div class="secret-container"><h2>Thank you for reading till the end! 💖</h2></div></div>`}

    <div class="contact-page" id="contactPage">
        <div class="contact-container">
            <h2><i class="fas fa-envelope"></i> Contact</h2>
            <form id="contact-form">
                <div class="form-group"><label>Your Name</label><input type="text" name="from_name" placeholder="Enter your name" required></div>
                <div class="form-group"><label>Your Email</label><input type="email" name="from_email" placeholder="Enter your email" required></div>
                <div class="form-group"><label>Message</label><textarea name="message" placeholder="Write your message..." required></textarea></div>
                <button type="submit" class="submit-btn"><i class="fas fa-paper-plane"></i> Send Message</button>
                <div id="form-status"></div>
            </form>
            <div class="social-buttons">
                ${c.facebookUrl ? `<a href="${c.facebookUrl}" target="_blank" class="social-btn facebook"><i class="fab fa-facebook-f"></i><span>Facebook</span></a>` : ""}
                ${c.instagramUrl ? `<a href="${c.instagramUrl}" target="_blank" class="social-btn instagram"><i class="fab fa-instagram"></i><span>Instagram</span></a>` : ""}
            </div>
            <button class="close-contact-btn" onclick="closeContactPage()"><i class="fas fa-times"></i> Close</button>
        </div>
    </div>

<script>
    ${c.emailjsPublicKey ? `(function() { emailjs.init("${c.emailjsPublicKey}"); })();` : ""}

    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const statusDiv = document.getElementById('form-status');
        ${c.emailjsServiceId && c.emailjsTemplateId ? `
        statusDiv.innerHTML = '📤 Sending...';
        emailjs.sendForm('${c.emailjsServiceId}', '${c.emailjsTemplateId}', this)
            .then(function() { statusDiv.innerHTML = '✅ Message sent!'; document.getElementById('contact-form').reset(); })
            .catch(function() { statusDiv.innerHTML = '❌ Failed to send'; });
        ` : `statusDiv.innerHTML = '✅ Thanks! (contact form not fully configured yet)'; document.getElementById('contact-form').reset();`}
    });

    const CONFIG = ${configJs};
    const reasons = ${reasonsJs};

    function createFloatingElement() {
        const container = document.getElementById('floatingElements');
        const symbols = ['🦋','🌸','🌼','🌺'];
        const el = document.createElement('div');
        el.className = 'float-item';
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.animationDelay = Math.random() * 5 + 's';
        el.style.fontSize = (Math.random() * 1.5 + 1.5) + 'rem';
        container.appendChild(el);
        setTimeout(() => el.remove(), 15000);
    }
    setInterval(createFloatingElement, 2000);
    for (let i = 0; i < 10; i++) setTimeout(createFloatingElement, i * 500);

    const countdownAudio = document.getElementById('countdownAudio');
    const birthdayAudio = document.getElementById('birthdayWish');

    let cakeCut = false, candlesBlown = 0, totalCandles = CONFIG.age, confettiShown = false;
    let audioStream = null, audioContext = null, analyser = null, blowInterval = null;
    let countdownFinished = false, birthdayAudioPlayed = false, countdownAudioPlayed = false, audioAllowed = false, resetTimer = null;
    let currentReasonIndex = 0, isTransitioning = false, historyStack = ['countdown'];
    let charIndex = 0;

    function updateHistory(screen) { historyStack.push(screen); history.pushState({ screen }, '', '#' + screen); }
    window.addEventListener('popstate', function() {
        if (historyStack.length > 1) { historyStack.pop(); showScreen(historyStack[historyStack.length-1]); }
        else showScreen('countdown');
    });

    function showScreen(screen) {
        ['countdownScreen','greetingScreen','cakeScreen','reasonsScreen','photoScreen','videoScreen','letterScreen','secretScreen'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (id === 'countdownScreen') el.classList.add('hide'); else el.classList.remove('show');
        });
        const map = { countdown:'countdownScreen', greeting:'greetingScreen', cake:'cakeScreen', reasons:'reasonsScreen', photo:'photoScreen', video:'videoScreen', letter:'letterScreen', secret:'secretScreen' };
        const target = document.getElementById(map[screen]);
        if (screen === 'countdown') target.classList.remove('hide'); else target.classList.add('show');
    }

    function createFloatingHeart() {
        const container = document.getElementById('floatingHearts');
        const heart = document.createElement('div');
        heart.className = 'heart-float';
        heart.textContent = ['💖','💝','💗','💓','💕'][Math.floor(Math.random()*5)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.setProperty('--float-duration', (Math.random() * 4 + 4) + 's');
        heart.style.setProperty('--delay', Math.random() * 3 + 's');
        heart.style.setProperty('--translate-x', (Math.random() * 60 - 30) + 'px');
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 8000);
    }
    setInterval(createFloatingHeart, 800);

    document.addEventListener('mousemove', (e) => {
        const cursor = document.querySelector('.custom-cursor');
        if (window.gsap) gsap.to(cursor, { x: e.clientX - 15, y: e.clientY - 15, duration: 0.2 });
        else { cursor.style.left = (e.clientX - 15) + 'px'; cursor.style.top = (e.clientY - 15) + 'px'; }
    });

    const greetingText = ${JSON.stringify(c.greetingTyped)};
    const greetingElement = document.getElementById('greetingText');
    function typeGreeting() { if (charIndex < greetingText.length) { greetingElement.textContent += greetingText.charAt(charIndex); charIndex++; setTimeout(typeGreeting, 100); } }

    function handleGlobalClick() {
        if (!audioAllowed) { audioAllowed = true; document.getElementById('playBtn').classList.add('hide'); }
        const now = new Date();
        const isBirthdayToday = (now.getMonth() === CONFIG.month && now.getDate() === CONFIG.day);
        if (isBirthdayToday && !birthdayAudioPlayed) {
            birthdayAudio.play().then(() => { birthdayAudioPlayed = true; }).catch(() => {});
        }
    }
    document.body.addEventListener('click', handleGlobalClick);
    document.body.addEventListener('touchstart', handleGlobalClick);

    window.startAudio = function(event) {
        if (event) event.stopPropagation();
        audioAllowed = true;
        document.getElementById('playBtn').classList.add('hide');
        const now = new Date();
        const isBirthdayToday = (now.getMonth() === CONFIG.month && now.getDate() === CONFIG.day);
        if (isBirthdayToday && !birthdayAudioPlayed) birthdayAudio.play().then(() => { birthdayAudioPlayed = true; }).catch(() => {});
    };

    window.openLightbox = function(src) { document.getElementById('lightboxImg').src = src; document.getElementById('lightbox').classList.add('show'); };
    window.closeLightbox = function(event) { if (event.target === document.getElementById('lightbox') || event.target.classList.contains('close')) document.getElementById('lightbox').classList.remove('show'); };

    function scheduleAutoReset() {
        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
            countdownFinished = false; birthdayAudioPlayed = false; countdownAudioPlayed = false; confettiShown = false;
            cakeCut = false; candlesBlown = 0; currentReasonIndex = 0; historyStack = ['countdown'];
            showScreen('countdown'); updateCountdown();
        }, 86400000);
    }

    function getMonthName(i) { return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]; }
    function getTimeSuffix(h) { return h >= 12 ? 'PM' : 'AM'; }
    function formatHour(h) { return h % 12 || 12; }

    function updateCountdown() {
        const now = new Date();
        const isBirthdayToday = (now.getMonth() === CONFIG.month && now.getDate() === CONFIG.day);
        const timeSuffix = getTimeSuffix(CONFIG.hour);
        const displayHour = formatHour(CONFIG.hour);
        const minuteStr = String(CONFIG.minute).padStart(2, '0');
        document.getElementById('countdownMessage').innerHTML = \`⏰ \${CONFIG.day} \${getMonthName(CONFIG.month)}, \${displayHour}:\${minuteStr} \${timeSuffix}\`;

        if (isBirthdayToday) {
            if (!countdownFinished) { countdownFinished = true; countdownAudio.pause(); countdownAudio.currentTime = 0; }
            document.getElementById('countdownScreen').classList.add('hide');
            document.getElementById('greetingScreen').classList.add('show');
            if (!confettiShown) { confettiShown = true; confetti({ particleCount: 100, spread: 70 }); }
            if (charIndex === 0) typeGreeting();
            if (!birthdayAudioPlayed) {
                birthdayAudio.play().then(() => { birthdayAudioPlayed = true; }).catch(() => { document.getElementById('playBtn').classList.remove('hide'); });
            }
            scheduleAutoReset();
            return;
        }

        countdownFinished = false;
        document.getElementById('greetingScreen').classList.remove('show');
        document.getElementById('countdownScreen').classList.remove('hide');

        const currentYear = now.getFullYear();
        let birthday = new Date(currentYear, CONFIG.month, CONFIG.day, CONFIG.hour, CONFIG.minute, 0);
        if (now > birthday) birthday = new Date(currentYear + 1, CONFIG.month, CONFIG.day, CONFIG.hour, CONFIG.minute, 0);
        const diff = birthday - now;
        if (diff > 0) {
            document.getElementById('days').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
            document.getElementById('hours').textContent = String(Math.floor((diff / 3600000) % 24)).padStart(2, '0');
            document.getElementById('mins').textContent = String(Math.floor((diff / 60000) % 60)).padStart(2, '0');
            document.getElementById('secs').textContent = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
        }
        if (diff <= 10000 && diff > 0 && !countdownAudioPlayed && audioAllowed) {
            countdownAudio.play().then(() => { countdownAudioPlayed = true; }).catch(() => {});
        }
    }

    window.goToCakeScreen = function() {
        const anim = window.gsap ? gsap.to('#greetingScreen', { opacity:0, duration:1 }) : Promise.resolve();
        setTimeout(() => {
            document.getElementById('greetingScreen').classList.remove('show');
            document.getElementById('cakeScreen').classList.add('show');
            updateHistory('cake');
            loadCakeState();
        }, window.gsap ? 1000 : 0);
    };

    function loadCakeState() {
        const today = new Date();
        const dateStr = \`\${today.getFullYear()}-\${String(CONFIG.month+1).padStart(2,'0')}-\${String(CONFIG.day).padStart(2,'0')}\`;
        cakeCut = localStorage.getItem('cut_' + dateStr) === 'true';
        candlesBlown = parseInt(localStorage.getItem('blown_' + dateStr) || '0');
        renderCake();
        if (cakeCut) showCakeNextButton();
    }

    function showCakeNextButton() {
        if (!document.getElementById('cakeNextBtn')) {
            const btn = document.createElement('button');
            btn.id = 'cakeNextBtn';
            btn.className = 'cake-next-btn';
            btn.textContent = 'Enter your storyline 💫';
            btn.onclick = goToReasonsScreen;
            document.getElementById('cakeScreen').appendChild(btn);
        }
    }

    function saveState() {
        const today = new Date();
        const dateStr = \`\${today.getFullYear()}-\${String(CONFIG.month+1).padStart(2,'0')}-\${String(CONFIG.day).padStart(2,'0')}\`;
        localStorage.setItem('blown_' + dateStr, candlesBlown.toString());
    }

    function renderCake() {
        const cakeEmoji = document.getElementById('cakeEmoji');
        const candlesDiv = document.getElementById('candles');
        const statusDiv = document.getElementById('cakeStatus');
        const cutBtn = document.getElementById('cutBtn');
        if (cakeCut) {
            cakeEmoji.textContent = '🍰'; candlesDiv.innerHTML = ''; statusDiv.textContent = '🎉 Cake cut! Happy Birthday! 🎉';
            cutBtn.style.display = 'none'; stopMicrophone(); showCakeNextButton(); return;
        }
        cakeEmoji.textContent = '🎂'; cutBtn.style.display = 'block'; cutBtn.disabled = true;
        let html = '';
        for (let i = 0; i < totalCandles; i++) html += \`<span class="candle \${i < candlesBlown ? 'blown' : ''}" onclick="blowCandle(\${i})">🕯️</span>\`;
        candlesDiv.innerHTML = html;
        if (candlesBlown === totalCandles) { statusDiv.textContent = '🎉 All candles blown! Now cut the cake'; cutBtn.disabled = false; stopMicrophone(); }
        else { statusDiv.textContent = \`\${totalCandles - candlesBlown} candles burning - Blow or tap\`; cutBtn.disabled = true; }
    }

    window.blowCandle = function(index) {
        if (cakeCut || candlesBlown === totalCandles || index < candlesBlown) return;
        candlesBlown = index + 1; saveState(); renderCake(); confetti({ particleCount:5, spread:30, colors:['#aaaaaa'] });
    };

    function blowMultipleCandles(count) {
        if (cakeCut || candlesBlown === totalCandles) return;
        const newBlown = Math.min(candlesBlown + count, totalCandles);
        if (newBlown > candlesBlown) { candlesBlown = newBlown; saveState(); renderCake(); confetti({ particleCount:8*count, spread:40, colors:['#aaaaaa'] }); }
    }

    function startMicrophone() {
        if (cakeCut || candlesBlown === totalCandles) return;
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            audioStream = stream;
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            audioContext.createMediaStreamSource(stream).connect(analyser);
            analyser.fftSize = 256;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            if (blowInterval) clearInterval(blowInterval);
            blowInterval = setInterval(() => {
                if (cakeCut || candlesBlown === totalCandles) { stopMicrophone(); return; }
                analyser.getByteFrequencyData(dataArray);
                let sum = 0; for (let i=0;i<dataArray.length;i++) sum += dataArray[i];
                if (sum / dataArray.length > 50) blowMultipleCandles(2 + Math.floor(Math.random()*2));
            }, 150);
        }).catch(() => {});
    }

    function stopMicrophone() {
        if (blowInterval) { clearInterval(blowInterval); blowInterval = null; }
        if (audioStream) { audioStream.getTracks().forEach(t => t.stop()); audioStream = null; }
        if (audioContext && audioContext.state !== 'closed') { audioContext.close(); audioContext = null; }
    }
    document.getElementById('candles')?.addEventListener('click', startMicrophone, { once: false });
    document.addEventListener('DOMContentLoaded', () => { document.getElementById('cakeScreen')?.addEventListener('click', startMicrophone, { once: true }); });

    window.cutCake = function() {
        if (cakeCut || candlesBlown !== totalCandles) return;
        const today = new Date();
        const dateStr = \`\${today.getFullYear()}-\${String(CONFIG.month+1).padStart(2,'0')}-\${String(CONFIG.day).padStart(2,'0')}\`;
        cakeCut = true;
        localStorage.setItem('cut_' + dateStr, 'true');
        stopMicrophone(); renderCake();
        confetti({ particleCount:150, spread:80 });
        setTimeout(() => confetti({ particleCount:100, spread:60, colors:['gold','hotpink'] }), 200);
        setTimeout(() => confetti({ particleCount:100, spread:60, colors:['cyan','purple'] }), 400);
    };

    function createReasonCard(reason) {
        const card = document.createElement('div');
        card.className = 'reason-card';
        const text = document.createElement('div');
        text.className = 'reason-text';
        text.innerHTML = \`\${reason.emoji} \${reason.text}\`;
        card.appendChild(text);
        if (reason.gif) {
            const gifOverlay = document.createElement('div');
            gifOverlay.className = 'gif-overlay';
            gifOverlay.innerHTML = \`<img src="\${reason.gif}" alt="Memory">\`;
            card.appendChild(gifOverlay);
        }
        return card;
    }

    function displayReason() {
        if (isTransitioning) return;
        isTransitioning = true;
        if (currentReasonIndex < reasons.length) {
            const card = createReasonCard(reasons[currentReasonIndex]);
            const container = document.getElementById('reasonsContainer');
            container.innerHTML = '';
            container.appendChild(card);
            if (window.gsap) gsap.from(card, { opacity:0, y:50, duration:0.5, ease:"back.out" });
            document.getElementById('reasonCounter').textContent = \`Reason \${currentReasonIndex + 1} of \${reasons.length}\`;
            currentReasonIndex++;
            if (currentReasonIndex === reasons.length) {
                const btn = document.getElementById('reasonsBtn');
                btn.textContent = "You're the BESTEST! 💖";
                btn.classList.add('story-mode');
            }
            setTimeout(() => { isTransitioning = false; }, 500);
        } else { goToPhotoScreen(); }
    }

    window.handleReasonClick = function() { displayReason(); };

    window.goToReasonsScreen = function() {
        birthdayAudio.pause(); birthdayAudio.currentTime = 0;
        currentReasonIndex = 0;
        document.getElementById('reasonsBtn').textContent = "Click Here... 💕";
        document.getElementById('reasonsBtn').classList.remove('story-mode');
        document.getElementById('reasonsContainer').innerHTML = '';
        document.getElementById('cakeScreen').classList.remove('show');
        document.getElementById('reasonsScreen').classList.add('show');
        updateHistory('reasons');
        displayReason();
    };

    window.goToPhotoScreen = function() {
        document.getElementById('reasonsScreen').classList.remove('show');
        document.getElementById('photoScreen').classList.add('show');
        updateHistory('photo');
    };
    window.goToVideoScreen = function() {
        document.getElementById('photoScreen').classList.remove('show');
        document.getElementById('videoScreen').classList.add('show');
        updateHistory('video');
    };
    window.goToLetterScreen = function() {
        document.getElementById('videoScreen').classList.remove('show');
        document.getElementById('letterScreen').classList.add('show');
        updateHistory('letter');
    };
    window.goToSecretScreen = function() {
        document.getElementById('letterScreen').classList.remove('show');
        document.getElementById('secretScreen').classList.add('show');
        updateHistory('secret');
    };

    window.openContactPage = function() { document.getElementById('contactPage').classList.add('show'); };
    window.closeContactPage = function() { document.getElementById('contactPage').classList.remove('show'); };

    function confetti(options) { if (typeof window.confetti === 'function') window.confetti(options); }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    window.addEventListener('beforeunload', function() {
        stopMicrophone(); countdownAudio.pause(); birthdayAudio.pause();
        if (resetTimer) clearTimeout(resetTimer);
    });
</script>
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1"></script>
</body>
</html>`;
}
