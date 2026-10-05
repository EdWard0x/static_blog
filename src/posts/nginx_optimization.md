---
title: nginx常用优化
date: 2026-10-05        # 发布日期
description: 'nginx常用优化总结'
tags: [optimization]     # 标签列表，自动生成分类索引
categories: [nginx]
draft: false                 # 是否为草稿（设为 true 则只在本地显示，不会发布到线上）
---


## 一、基础配置调优

### 1.1 工作进程配置

```
# 根据CPU核心数设置工作进程数
worker_processes auto;

# 工作进程绑定CPU核心
worker_cpu_affinity auto;

# 单个工作进程最大连接数
worker_connections 65535;

# 工作进程最大打开文件数
worker_rlimit_nofile 65535;
```

### 1.2 事件模型优化

```
events {
    # 使用epoll事件模型（Linux系统）
    use epoll;
    
    # 允许同时接受多个新连接
    multi_accept on;
    
    # 工作进程最大连接数
    worker_connections 65535;
    
    # 接受连接锁
    accept_mutex off;
}
```

### 1.3 网络连接优化

```
# 启用高效文件传输
sendfile on;

# 优化sendfile性能
tcp_nopush on;
tcp_nodelay on;

# 连接保持时间
keepalive_timeout 65;
keepalive_requests 100;

# 客户端请求头超时
client_header_timeout 15;

# 客户端请求体超时
client_body_timeout 15;

# 向客户端发送响应超时
send_timeout 15;
```

## 二、内存和缓冲区调优

### 2.1 缓冲区设置

```
# 客户端请求头缓冲区
client_header_buffer_size 4k;
large_client_header_buffers 8 8k;

# 客户端请求体缓冲区
client_body_buffer_size 128k;
client_max_body_size 100m;

# 代理缓冲区
proxy_buffer_size 4k;
proxy_buffers 8 4k;
proxy_busy_buffers_size 8k;

# FastCGI缓冲区
fastcgi_buffer_size 4k;
fastcgi_buffers 8 4k;
fastcgi_busy_buffers_size 8k;
```

### 2.2 文件缓存配置

```
# 打开文件缓存
open_file_cache max=100000 inactive=20s;
open_file_cache_valid 30s;
open_file_cache_min_uses 2;
open_file_cache_errors on;

# 日志缓存
access_log /var/log/nginx/access.log main buffer=32k flush=5s;
error_log /var/log/nginx/error.log warn;
```

## 三、压缩优化

### 3.1 Gzip压缩

```
# 启用Gzip压缩
gzip on;
gzip_vary on;
gzip_min_length 1000;
gzip_comp_level 6;
gzip_proxied any;

# 压缩文件类型
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/json
    application/xml+rss
    application/atom+xml
    image/svg+xml;

# 压缩缓冲区
gzip_buffers 16 8k;
gzip_http_version 1.1;
```

### 3.2 Brotli压缩（需要模块支持）

```
# 启用Brotli压缩
brotli on;
brotli_comp_level 6;
brotli_min_length 1000;
brotli_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/json
    application/xml
    application/rss+xml
    application/atom+xml
    image/svg+xml;
```

## 四、SSL/TLS优化

### 4.1 SSL配置优化

```
# SSL协议版本
ssl_protocols TLSv1.2 TLSv1.3;

# 加密套件
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
ssl_prefer_server_ciphers on;

# SSL会话缓存
ssl_session_cache shared:SSL:50m;
ssl_session_timeout 1d;
ssl_session_tickets off;

# OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /path/to/ca-bundle.crt;
```

### 4.2 HTTP/2配置

```
server {
    listen 443 ssl http2;
    server_name example.com;
    
    # HTTP/2推送
    http2_push_preload on;
    
    # 其他SSL配置...
}
```

## 五、负载均衡和代理优化

### 5.1 上游服务器配置

```
upstream backend {
    # 负载均衡算法
    ip_hash;
    
    # 后端服务器
    server 192.168.1.10:8080 weight=3 max_fails=3 fail_timeout=30s;
    server 192.168.1.11:8080 weight=2 max_fails=3 fail_timeout=30s;
    server 192.168.1.12:8080 weight=1 max_fails=3 fail_timeout=30s backup;
    
    # 连接保持
    keepalive 32;
    keepalive_requests 100;
    keepalive_timeout 60s;
}
```

### 5.2 代理配置优化

```
location / {
    proxy_pass http://backend;
    
    # 代理超时设置
    proxy_connect_timeout 5s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    # 代理缓冲
    proxy_buffering on;
    proxy_buffer_size 4k;
    proxy_buffers 8 4k;
    
    # 代理头信息
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # HTTP版本
    proxy_http_version 1.1;
    proxy_set_header Connection "";
}
```

## 六、缓存策略

### 6.1 静态资源缓存

```
# 图片、CSS、JS缓存
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
}

# 字体文件缓存
location ~* \.(woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public";
    add_header Access-Control-Allow-Origin *;
}
```

### 6.2 代理缓存

```
# 缓存配置
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;

server {
    location / {
        proxy_cache my_cache;
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404 1m;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        proxy_cache_lock on;
        proxy_cache_lock_timeout 5s;
        
        # 缓存key
        proxy_cache_key $scheme$proxy_host$request_uri;
        
        # 缓存头信息
        add_header X-Cache-Status $upstream_cache_status;
        
        proxy_pass http://backend;
    }
}
```

## 七、安全加固

### 7.1 基础安全配置

```
# 隐藏版本信息
server_tokens off;

# 安全头
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# 限制请求方法
if ($request_method !~ ^(GET|HEAD|POST)$) {
    return 405;
}
```

### 7.2 请求限制

```
# 限制请求频率
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

server {
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        limit_req_status 429;
    }
    
    location /login {
        limit_req zone=login burst=5 nodelay;
        limit_req_status 429;
    }
}

# 限制连接数
limit_conn_zone $binary_remote_addr zone=conn_limit_per_ip:10m;
limit_conn conn_limit_per_ip 10;
```

## 八、监控和日志

### 8.1 访问日志优化

```
# 自定义日志格式
log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" "$http_x_forwarded_for" '
                '$request_time $upstream_response_time';

# 条件日志记录
map $status $loggable {
    ~^[23]  0;
    default 1;
}

access_log /var/log/nginx/access.log main buffer=32k flush=5s if=$loggable;
```

### 8.2 状态监控

```
# 启用状态页面
location /nginx_status {
    stub_status on;
    access_log off;
    allow 127.0.0.1;
    allow 192.168.1.0/24;
    deny all;
}
```

## 九、性能监控和调优工具

### 9.1 监控指标

关键监控指标包括：

-   • 请求处理时间
    
-   • 并发连接数
    
-   • 错误率
    
-   • 内存使用情况
    
-   • CPU使用率
    
-   • 网络带宽利用率
    

### 9.2 性能测试工具

```
# 使用wrk进行压力测试
wrk -t12 -c400 -d30s --latency http://example.com/

# 使用ab进行基准测试
ab -n 10000 -c 100 http://example.com/

# 使用siege进行并发测试
siege -c 100 -t 30s http://example.com/
```

## 十、最佳实践总结

1.  1. **合理配置工作进程数**：通常设置为CPU核心数或使用auto自动检测
    
2.  2. **优化缓冲区大小**：根据实际业务需求调整缓冲区大小
    
3.  3. **启用压缩**：对文本类型资源启用gzip压缩
    
4.  4. **配置合理的超时时间**：避免长时间占用连接
    
5.  5. **使用HTTP/2**：提升多路复用性能
    
6.  6. **实施缓存策略**：合理设置静态资源和代理缓存
    
7.  7. **定期监控和优化**：持续监控性能指标并进行调优
    

## 十一、故障排查

### 11.1 常见问题诊断

```
# 检查Nginx配置
nginx -t

# 查看错误日志
tail -f /var/log/nginx/error.log

# 检查进程状态
ps aux | grep nginx

# 查看连接状态
netstat -an | grep :80 | wc -l

# 检查文件描述符使用情况
lsof -u nginx | wc -l
```

### 11.2 性能问题排查

当遇到性能问题时，应该：

1.  1\. 检查系统资源使用情况
    
2.  2\. 分析访问日志模式
    
3.  3\. 监控上游服务器响应时间
    
4.  4\. 检查缓存命中率
    
5.  5\. 分析网络连接状态
    
