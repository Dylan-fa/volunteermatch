import { route } from "@react-router/dev/routes";

export default [
    route("/", "./pages/Home.jsx"),
    route("/browse", "./pages/BrowseOpportunities.jsx"),
    route("/opportunity/:id", "./pages/OpportunityDetails.jsx"),
    route("/login", "./pages/Login.jsx"),
    route("/register", "./pages/Register.jsx"),
    route("/about", "./pages/AboutUs.jsx"),
    route("/opportunities/create", "./pages/CreateOpportunity.jsx"),
    route("/dashboard", "./pages/Dashboard.jsx"),
];
