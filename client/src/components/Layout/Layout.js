import Footer from "../Footer/Footer";
import Navbar from "../NavBar/NavBar";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-content">{children}</div>
      <Footer />
    </div>
  );
}
