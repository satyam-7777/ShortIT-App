import NavBar from "../../components/NavBar/NavBar";
import Hero from "../../components/Hero/Hero";
import Footer from "../../components/Footer/Footer";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <NavBar />
      <main className="main">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
