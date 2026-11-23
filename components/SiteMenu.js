// components/SiteMenu.js
import StaggeredMenu from "./StaggeredMenu";

const items = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "Trending", ariaLabel: "See trending movies", link: "/trending" },
  { label: "Top Grossing", ariaLabel: "See top grossing movies", link: "/top-grossing" },
  { label: "Browse", ariaLabel: "Browse by language or genre", link: "/browse" },
  { label: "In Theatres", ariaLabel: "See movies in theatres", link: "/in-theatres" },
];

const groups = [
  {
    title: "Browse by language",
    links: [
      { label: "Hindi", link: "/browse/language/hi" },
      { label: "Telugu", link: "/browse/language/te" },
      { label: "Tamil", link: "/browse/language/ta" },
      { label: "Malayalam", link: "/browse/language/ml" },
      { label: "Kannada", link: "/browse/language/kn" },
    ],
  },
  {
    title: "Browse by genre",
    links: [
      { label: "Action", link: "/browse/genre/28" },
      { label: "Drama", link: "/browse/genre/18" },
      { label: "Comedy", link: "/browse/genre/35" },
      { label: "Thriller", link: "/browse/genre/53" },
    ],
  },
];

export default function SiteMenu() {
  return (
    <StaggeredMenu
      position="right"
      items={items}
      groups={groups}
      colors={["#f2b705", "#d92d20"]}
      accentColor="#d92d20"
      menuButtonColor="#fff"
      openMenuButtonColor="#111"
    />
  );
}