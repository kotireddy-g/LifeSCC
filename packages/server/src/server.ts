import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ═════════════════════════════════════════════════════');
    console.log(`   LifeSCC API Server is running!`);
    console.log('   ═══════════════════════════════════════════════════');
    console.log(`   🌐 Server URL: http://localhost:${PORT}`);
    console.log(`   📚 API Docs: http://localhost:${PORT}/api-docs`);
    console.log(`   ❤️  Health Check: http://localhost:${PORT}/health`);
    console.log(`   🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('   ═══════════════════════════════════════════════════');
    console.log('');
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
    console.log(`\n${signal} signal received: closing HTTP server`);
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
