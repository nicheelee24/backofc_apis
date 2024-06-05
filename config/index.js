export * from './error-message.js'
export * from './http-status-code.js'
// export * from './shared-schema'

export default {
    sqlDb: {
        host: process.env.SERVER_HOST || 'localhost',
        dbUser : process.env.DB_USER || 'root',
        dbPassword : process.env.DB_PASSWORD || '1234',
        dbName : process.env.DB_NAME || 'obex_db'
    },
    jwtOption: {
        secret: 'sbjhsf812jajksdjh88JHKLJSHF8QYjkhusydqyekjbasjkf723yljbsfkljweyr72rqkhjwbkqwg7',
        expiresIn: '45d'
    },
    serverAuth:{
        secret:'askaasdasas54d6as8d4as68d4as56f84sd6f8s74f154dsa21x65dds4fa7580'
    },
    country: 'en-IN',
    timeZone: 'Asia/Kolkata',
    queues: {
        PROCESS_AUDIO_QUEUE: "audio_transcription_queue",
        TRANSCRIPTION_RESULT_QUEUE: "transcription_result_queue",
        DISTRIBUTER: "DISTRIBUTER"
      },
    defaultOtpExpiry: 5000
};

export const tables = {
    MEMBER: 'member',
  };
export const status = {
    COMPLETED: "COMPLETED",
    STARTED: "STARTED",
    RUNNING: "RUNNING",
}

