---
title: nginx常用监控指标
date: 2026-10-05        # 发布日期
description: 'nginx常用监控指标总结'
tags: [metrics]     # 标签列表，自动生成分类索引
categories: [监控指标]
draft: false                 # 是否为草稿（设为 true 则只在本地显示，不会发布到线上）
---


### 请求和连接指标
```plaintext
# 每秒请求数
rate(nginx_http_requests_total[5m])

# 当前活跃连接数
nginx_connections_active

# 连接状态统计
nginx_connections_reading
nginx_connections_writing
nginx_connections_waiting

# 接受的连接数
rate(nginx_connections_accepted[5m])
```
### 响应状态码
```plaintext
# 各状态码的请求率
rate(nginx_http_responses_total{status=~"2.."}[5m])  # 2xx
rate(nginx_http_responses_total{status=~"3.."}[5m])  # 3xx
rate(nginx_http_responses_total{status=~"4.."}[5m])  # 4xx
rate(nginx_http_responses_total{status=~"5.."}[5m])  # 5xx

# 错误率
sum(rate(nginx_http_responses_total{status=~"4..|5.."}[5m])) / sum(rate(nginx_http_requests_total[5m])) * 100
``` 
### 响应时间和性能
```plaintext
# 请求处理时间
nginx_http_request_time_seconds

# 上游响应时间
nginx_upstream_response_time_seconds

# 请求体大小
nginx_http_request_body_bytes_total

# 响应体大小
nginx_http_response_body_bytes_total
```