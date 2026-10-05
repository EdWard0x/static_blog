---
title: 线路vps网络优化
date: 2026-10-03        # 发布日期
description: '刚装好的vps小鸡如果网络测速效果不佳，可以尝试优化'
tags: [network_optimization]     # 标签列表，自动生成分类索引
categories: [Vps]
draft: false                 # 是否为草稿（设为 true 则只在本地显示，不会发布到线上）
---

放在/etc/sysctl.d/99-z-net.conf

```text
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr

net.core.rmem_max = 33554432
net.core.wmem_max = 33554432

net.ipv4.tcp_rmem = 4096 131072 33554432
net.ipv4.tcp_wmem = 4096 131072 33554432

net.ipv4.tcp_window_scaling = 1
net.ipv4.tcp_moderate_rcvbuf = 1

net.ipv4.tcp_slow_start_after_idle = 0
net.ipv4.tcp_mtu_probing = 1

net.core.netdev_max_backlog = 16384

net.ipv4.tcp_sack = 1
net.ipv4.tcp_dsack = 1
net.ipv4.tcp_timestamps = 1
net.ipv4.tcp_early_retrans = 3
net.ipv4.tcp_recovery = 1
```