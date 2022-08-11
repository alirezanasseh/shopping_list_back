export const config = {
    secret: process.env.SECRET,
    port: process.env.PORT || 8700,
    database_url: process.env.MONGO_URI || ''
}