

const requestModule = {

    /**
     * Get an array of missing required fields.
     * Treats `required: undefined` as required by default.
     * 
     * @param {Array} fields Array of field objects with `name` and optional `required`.
     * @param {object} obj The object to check for field presence.
     * @returns {Array} Array of missing field names.
     */
    getMissingFields: (fields, obj) => {
        
        return fields
            .filter(field => field.required !== false) // Treat `undefined` as required
            .map(field => field.name)
            .filter(key => !(key in obj)) // Check for missing fields by key existence
    },

    /**
     * Validate a string field.
     * 
     * @param {object} field Field object with `name`, `min`, `max`, and `pattern`.
     * @param {string} value The value of the field to validate.
     * @returns {string|null} Error message if validation fails, otherwise null.
     */
    validateStringField: (field, value) => {
        const length = value.trim().length

        if ('min' in field && length < field.min) return `${field.name} length must be at least ${field.min} characters`
        if ('max' in field && length > field.max) return `${field.name} length must be under ${field.max} characters`
        if ('pattern' in field && !field.pattern.test(value)) return `${field.name} must match the pattern ${field.pattern}`

        return null
    },

    /**
     * Validate a number field.
     * 
     * @param {object} field Field object with `name`, `min`, and `max`.
     * @param {number} value The value of the field to validate.
     * @returns {string|null} Error message if validation fails, otherwise null.
     */
    validateNumberField: (field, value) => {
        
        if ('min' in field && value < field.min) return `${field.name} must be at least ${field.min}`
        if ('max' in field && value > field.max) return `${field.name} must be under ${field.max}`

        return null
    },

    /**
     * Validate a single field, delegating to the appropriate validation method.
     * 
     * @param {object} field Field object to validate.
     * @param {*} value The value of the field in `obj`.
     * @returns {string|null} Error message if validation fails, otherwise null.
     */
    validateField: function(field, value) {
        
        if (typeof value === 'string') return this.validateStringField(field, value)
        else if (typeof value === 'number') return this.validateNumberField(field, value)
        
        return null
    },

    /**
     * Main validation function.
     * 
     * @param {{ name: string, min?: number, max?: number, pattern?: RegExp, required?: boolean }[]} fields Array of field objects to validate.
     * @param {object} obj The object containing field values (e.g. headers, body, query, params, etc).
     * @param {object} res Response object to send errors.
     * @returns {boolean} `true` if validation passes, otherwise sends error response.
     */
    validateRequest: function(fields, obj, res) {
        
        // Check for missing fields
        const missingFields = this.getMissingFields(fields, obj)
        if (missingFields.length !== 0) return res.status(400).send(`Fields (${missingFields.join(', ')}) are required`)

        // Validate each field
        for (const field of fields) {
            const value = obj[field.name]
            const error = this.validateField(field, value)
            
            if (error) return res.status(422).send(error)
        }

        // If all validations pass
        return true
    }

}


module.exports = requestModule