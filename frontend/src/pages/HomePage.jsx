import HomePageFeature from "../components/Homepage/HomePageFeature";
import HomePageFooter from "../components/Homepage/HomePageFooter";
import HomePageHighlight from "../components/Homepage/HomePageHighlight";
import HomePageMain from "../components/Homepage/HomePageMain";
import HomePageNavigation from "../components/Homepage/HomePageNavigation";
import HomePagePricing from "../components/Homepage/HomePagePricing";
import HomePageReview from "../components/Homepage/HomePageReview";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HomePageNavigation />
      <HomePageMain />
      <HomePageFeature />
      <HomePageReview />
      <HomePagePricing />
      <HomePageHighlight />
      <HomePageFooter />
    </div>
  );
};

export default HomePage;
