---
title: Linux基础优化
date: 2026-10-05        # 发布日期
description: 'Linux基础优化'
tags: [optimization]     # 标签列表，自动生成分类索引
categories: [Linux]
draft: false                 # 是否为草稿（设为 true 则只在本地显示，不会发布到线上）
---

### 内核参数调优
```bash
cat >> /etc/sysctl.conf <<'EOF'
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 1200
net.ipv4.tcp_max_tw_buckets = 5000
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_tw_recycle = 1
net.ipv4.ip_local_port_range = 1024 65535
fs.file-max = 6815744
EOF
```

### 文件描述符限制
```bash
cat >> /etc/security/limits.conf <<'EOF'
* soft nofile 65535
* hard nofile 65535
root soft nproc 65535
root hard nproc 65535
EOF
```