import AppIntro from "../AppIntro/AppIntro";
import UrlShortenerCard from "../UrlShortnerCard/UrlShortenerCard";
import "./Hero.css";

export default function Hero() {
  return (
    <div className="hero">
      <AppIntro />
      <section className="card-container">
        <UrlShortenerCard />
      </section>
    </div>
  );
}
