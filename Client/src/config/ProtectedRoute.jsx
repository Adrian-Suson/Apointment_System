import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, redirectPath = "/" }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    redirectPath: PropTypes.string,
};

export default ProtectedRoute;