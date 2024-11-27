const zod = require('zod');

// SCHEMAS TO VALIDATE JSON DATA
schoolSchema = zod.object({
    name: zod.string().min(1, { message: 'Name cannot be empty'}),
    address: zod.string().min(1, { message: 'Address cannot be empty'}),
    latitude: zod.number().min(-90.0, { message: 'Latitude cannot be less than -90.0' }).max(90.0, { message: 'Latitude cannot be more than 90.0' }),
    longitude: zod.number().min(-180.0, { message: 'Longitude cannot be less than -180.0' }).max(180.0, { message: 'Longitude cannot be more than 180.0' })
})

partialSchoolSchema = schoolSchema.partial();

module.exports = { schoolSchema, partialSchoolSchema }