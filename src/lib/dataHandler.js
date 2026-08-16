/**
 * Data Handler Utilities
 * Ensures clean separation: Database data OR Hardcoded data, never both
 */

/**
 * Get data from database, show nothing if not available
 * Don't merge with hardcoded defaults
 *
 * Usage:
 * const heroData = useDbData(dbData, 'geo_heading');
 *
 * Result:
 * - If dbData exists and has geo_heading → show it
 * - If dbData exists but geo_heading is empty → show nothing (not hardcoded)
 * - If dbData doesn't exist → show nothing (not hardcoded)
 */
export const useDbData = (dbData, fieldName) => {
  if (!dbData) return null;
  if (dbData[fieldName] === undefined || dbData[fieldName] === null) return null;
  if (typeof dbData[fieldName] === 'string' && dbData[fieldName].trim() === '') return null;
  return dbData[fieldName];
};

/**
 * Choose between database data OR hardcoded, never mix
 *
 * Usage:
 * const value = chooseData(
 *   dbData?.geo_heading,
 *   "Hardcoded Default Heading"
 * );
 *
 * Result:
 * - If dbData?.geo_heading exists → show it
 * - If dbData?.geo_heading is empty/null/undefined → show hardcoded
 */
export const chooseData = (dbValue, hardcodedDefault) => {
  // Check if db value is valid
  if (dbValue === undefined || dbValue === null) {
    return hardcodedDefault;
  }

  // Check if string is empty
  if (typeof dbValue === 'string' && dbValue.trim() === '') {
    return hardcodedDefault;
  }

  // Check if array is empty
  if (Array.isArray(dbValue) && dbValue.length === 0) {
    return hardcodedDefault;
  }

  // DB value is valid, use it
  return dbValue;
};

/**
 * Check if we have complete database data
 * If we have ANY database data, use ONLY database data
 * If we have NO database data, use hardcoded data
 *
 * Usage:
 * if (hasDbData(dbData)) {
 *   renderDatabaseVersion(dbData)
 * } else {
 *   renderHardcodedVersion()
 * }
 */
export const hasDbData = (dbData) => {
  if (!dbData) return false;
  if (Array.isArray(dbData)) return dbData.length > 0;
  if (typeof dbData === 'object') {
    // Check if object has any non-empty values
    return Object.values(dbData).some(value => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    });
  }
  return !!dbData;
};

/**
 * Render either database OR hardcoded, but not both
 *
 * Usage:
 * renderDbOrHardcoded(
 *   dbData,
 *   (data) => <DatabaseVersion data={data} />,
 *   () => <HardcodedVersion />
 * );
 */
export const renderDbOrHardcoded = (dbData, renderDb, renderHardcoded) => {
  if (hasDbData(dbData)) {
    return renderDb(dbData);
  }
  return renderHardcoded();
};

/**
 * Filter empty fields from database object
 * Returns only fields that have actual values
 *
 * Usage:
 * const cleanData = filterEmptyFields(dbData);
 */
export const filterEmptyFields = (obj) => {
  if (!obj || typeof obj !== 'object') return null;

  const cleaned = {};
  Object.keys(obj).forEach(key => {
    const value = obj[key];

    // Skip empty values
    if (value === undefined || value === null) return;
    if (typeof value === 'string' && value.trim() === '') return;
    if (Array.isArray(value) && value.length === 0) return;

    // Include non-empty value
    cleaned[key] = value;
  });

  return Object.keys(cleaned).length > 0 ? cleaned : null;
};

/**
 * Merge database data with hardcoded defaults strategically
 * Only use this if you INTENTIONALLY want to merge specific fields
 *
 * Usage:
 * const data = mergeWithDefaults(dbData, {
 *   title: 'Hardcoded Title',
 *   description: 'Hardcoded Description'
 * });
 *
 * Result:
 * {
 *   title: dbData.title OR 'Hardcoded Title',
 *   description: dbData.description OR 'Hardcoded Description'
 * }
 */
export const mergeWithDefaults = (dbData, defaults) => {
  const result = { ...defaults };

  if (!dbData) return result;

  Object.keys(defaults).forEach(key => {
    const dbValue = dbData[key];

    // Only override if db value is not empty
    if (dbValue !== undefined && dbValue !== null) {
      if (typeof dbValue === 'string' && dbValue.trim() !== '') {
        result[key] = dbValue;
      } else if (!['string', 'undefined', 'null'].includes(typeof dbValue)) {
        result[key] = dbValue;
      }
    }
  });

  return result;
};

/**
 * Validate data structure
 * Useful for checking if database fetch returned expected shape
 *
 * Usage:
 * if (validateData(dbData, ['heading', 'subheading'])) {
 *   useDbData()
 * } else {
 *   useHardcoded()
 * }
 */
export const validateData = (data, requiredFields = []) => {
  if (!data) return false;

  if (requiredFields.length === 0) {
    return hasDbData(data);
  }

  return requiredFields.every(field => {
    const value = data[field];
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  });
};
