/**
 * Icon Name to Component Mapping
 * Maps string keys from the database to actual react-icons components
 */

import {
  FaFileAlt,
  FaChartLine,
  FaKey,
  FaEdit,
  FaCog,
  FaLink,
  FaMapMarkerAlt,
  FaChartPie,
  FaWordpress,
  FaShopify,
  FaSearch,
  FaBriefcase,
  FaProjectDiagram,
  FaStar,
  FaGlobe,
  FaThumbsUp,
  FaSyncAlt,
  FaUsers,
  FaHeadset,
  FaArrowRight,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaPaperPlane,
  FaCheckCircle,
  FaPlus,
  FaMinus,
  FaUser,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaLinkedinIn,
  FaFacebookF,
  FaLongArrowAltRight,
  FaHandPointRight,
  FaPhoneAlt,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

import {
  MdWeb,
  MdAutoGraph,
  MdSearch,
} from 'react-icons/md';

import {
  SiWix,
  SiWoo,
  SiSquarespace,
  SiGoogleanalytics,
  SiGoogletagmanager,
  SiSemrush,
  SiGoogleads,
  SiUpwork,
  SiOpenai,
  SiGoogle,
  SiMicrosoft,
  SiMeta,
} from 'react-icons/si';

const iconMap = {
  // FA icons (most commonly used)
  FaFileAlt,
  FaChartLine,
  FaKey,
  FaEdit,
  FaCog,
  FaLink,
  FaMapMarkerAlt,
  FaChartPie,
  FaWordpress,
  FaShopify,
  FaSearch,
  FaBriefcase,
  FaProjectDiagram,
  FaStar,
  FaGlobe,
  FaThumbsUp,
  FaSyncAlt,
  FaUsers,
  FaHeadset,
  FaArrowRight,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaPaperPlane,
  FaCheckCircle,
  FaPlus,
  FaMinus,
  FaUser,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaLinkedinIn,
  FaFacebookF,
  FaLongArrowAltRight,
  FaHandPointRight,
  FaPhoneAlt,
  FaChevronLeft,
  FaChevronRight,

  // Material Design icons
  MdWeb,
  MdAutoGraph,
  MdSearch,

  // Simple Icons
  SiWix,
  SiWoo,
  SiSquarespace,
  SiGoogleanalytics,
  SiGoogletagmanager,
  SiSemrush,
  SiGoogleads,
  SiUpwork,
  SiOpenai,
  SiGoogle,
  SiMicrosoft,
  SiMeta,
};

/**
 * Get a react-icon component by name, with optional fallback
 * @param {string} iconName - The icon key (e.g. 'FaBriefcase')
 * @param {React.ComponentType} fallback - Fallback component if not found
 * @returns {React.ComponentType} The icon component or fallback
 */
export function getIcon(iconName, fallback = FaCheckCircle) {
  if (!iconName) return fallback;
  return iconMap[iconName] || fallback;
}

/**
 * Render an icon by name with props
 * Usage: <Icon name="FaBriefcase" className="text-blue-500" />
 */
export function Icon({ name, fallback, ...props }) {
  const Component = getIcon(name, fallback);
  return <Component {...props} />;
}

export default iconMap;
