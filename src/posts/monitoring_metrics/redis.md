---
title: redis常用监控指标
date: 2026-10-05        # 发布日期
description: 'redis常用监控指标总结'
tags: [metrics]     # 标签列表，自动生成分类索引
categories: [监控指标]
draft: false                 # 是否为草稿（设为 true 则只在本地显示，不会发布到线上）
---


### 内存使用指标
```plaintext
# 已用内存
redis_memory_used_bytes

# 内存碎片率
redis_memory_fragmentation_ratio

# 最大内存
redis_memory_max_bytes

# 内存使用率
redis_memory_used_bytes / redis_memory_max_bytes * 100
```  
    
### 命令和操作指标
```plaintext
# 每秒命令数
rate(redis_commands_processed_total[5m])

# 命令命中率
redis_keyspace_hits_total / (redis_keyspace_hits_total + redis_keyspace_misses_total) * 100

# 连接客户端数
redis_connected_clients

# 阻塞客户端数
redis_blocked_clients
```
    
### 持久化指标
```plaintext
# RDB最后保存状态
redis_rdb_last_save_status

# AOF当前大小
redis_aof_current_size_bytes

# 上次BGSAVE状态
redis_rdb_last_bgsave_status
```
    
### 键空间指标
```plaintext
# 数据库键数量
redis_db_keys

# 过期键数量
rate(redis_expired_keys_total[5m])

# 淘汰键数量
rate(redis_evicted_keys_total[5m])
```