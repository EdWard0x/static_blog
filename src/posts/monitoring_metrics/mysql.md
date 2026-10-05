---
title: mysql常用监控指标
date: 2026-10-05        # 发布日期
description: 'mysql常用监控指标总结'
tags: [metrics]     # 标签列表，自动生成分类索引
categories: [监控指标]
draft: false                 # 是否为草稿（设为 true 则只在本地显示，不会发布到线上）
---


### 连接和线程指标
```plaintext
# 当前连接数
mysql_global_status_threads_connected

# 最大连接数
mysql_global_variables_max_connections

# 连接使用率
mysql_global_status_threads_connected / mysql_global_variables_max_connections * 100

# 连接错误数
rate(mysql_global_status_connection_errors_total[5m])
``` 
    
### 查询性能指标
```plaintext
# QPS（每秒查询数）
rate(mysql_global_status_queries[5m])

# TPS（每秒事务数）
rate(mysql_global_status_questions[5m])

# 慢查询数
rate(mysql_global_status_slow_queries[5m])

# 查询缓存命中率
mysql_global_status_qcache_hits / (mysql_global_status_qcache_hits + mysql_global_status_qcache_inserts) * 100
```    
    
### 复制状态指标
```plaintext
# 主从延迟
mysql_slave_status_seconds_behind_master

# 复制IO线程状态
mysql_slave_status_slave_io_running

# 复制SQL线程状态
mysql_slave_status_slave_sql_running

# 复制错误数
mysql_slave_status_last_io_errno
```
    
### 缓冲区和表状态
```plaintext
# InnoDB缓冲池命中率
(1 - mysql_global_status_innodb_buffer_pool_reads / mysql_global_status_innodb_buffer_pool_read_requests) * 100

# 表锁等待
rate(mysql_global_status_table_locks_waited[5m])

# 行锁等待
rate(mysql_global_status_innodb_row_lock_waits[5m])
```