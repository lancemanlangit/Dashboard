import { useEffect, useRef, useState } from "react";
import "./App.css";


function App() {
  const canvasRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false);


  /* ====== CIRCUIT BACKGROUND ====== */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");


    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);


    let mouse = { x: null, y: null };
    window.addEventListener("mousemove", e => {
      mouse.x = e.x;
      mouse.y = e.y;
    });


    class Node {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
      }
      move() {
        this.x += this.vx;
        this.y += this.vy;


        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;


        if (mouse.x) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            this.x += dx / dist;
            this.y += dy / dist;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#00bfff";
        ctx.fill();
      }
    }


    const nodes = Array.from({ length: 140 }, () => new Node());
    let pulseOffset = 0;


    function drawConnections() {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);


          if (dist < 140) {
            ctx.strokeStyle = `rgba(0,191,255,${1 - dist / 140})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();


            // SIGNAL PULSE
            const t = (pulseOffset % dist) / dist;
            const px = nodes[i].x + dx * t;
            const py = nodes[i].y + dy * t;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(px, py, 2, 2);
          }
        }
      }
    }


    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => {
        n.move();
        n.draw();
      });
      drawConnections();
      pulseOffset += 1.5;
      requestAnimationFrame(animate);
    }


    animate();
    return () => window.removeEventListener("resize", resize);
  }, []);


  /* ====== LOGIN ====== */
  const handleLogin = () => {
    setTimeout(() => setLoggedIn(true), 700);
  };


  return (
    <div className="app">
      <canvas ref={canvasRef} className="background" />


      {!loggedIn ? (
        <div className="login-box">
          <h1>SYSTEM ACCESS</h1>
          <form onSubmit={e => { e.preventDefault(); handleLogin(); }}>
            <input className="login-input" placeholder="Username" />
            <input className="login-input" type="password" placeholder="Password" />
            <button type="submit" className="login-button">AUTHENTICATE</button>
          </form>
          <p className="footer">Secure Engineering Node</p>
        </div>
      ) : (
        <div className="dashboard">
          <h1>ENGINEERING DASHBOARD</h1>


          <div className="panels">
            <div className="panel">CPU LOAD<br /><span>42%</span></div>
            <div className="panel">MEMORY<br /><span>68%</span></div>
            <div className="panel">NETWORK<br /><span>ONLINE</span></div>
          </div>


          <div className="terminal">
            <p>{'>'} Initializing system core...</p>
            <p>{'>'} Routing signals through circuit grid</p>
            <p>{'>'} All nodes synchronized ✔</p>
            <p className="green">{'>'} SYSTEM STABLE</p>
          </div>
        </div>
      )}
    </div>
  );
}


export default App;
