# مرحله اول: Build
FROM node:18-alpine AS builder

# تنظیم working directory
WORKDIR /app

# کپی package files
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm ci

# کپی کدهای پروژه
COPY . .

# Build کردن پروژه Next.js
RUN npm run build

# مرحله دوم: Production
FROM node:18-alpine AS runner

WORKDIR /app

# تنظیم متغیر محیطی برای production
ENV NODE_ENV=production

# کپی فایل‌های ضروری از مرحله builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json

# ایجاد user غیر root برای امنیت بیشتر
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3000

# تنظیم متغیر محیطی برای port
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# اجرای Next.js
CMD ["node", "server.js"]
