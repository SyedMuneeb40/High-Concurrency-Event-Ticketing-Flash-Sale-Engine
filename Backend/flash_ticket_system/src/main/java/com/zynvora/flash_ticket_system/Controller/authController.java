package com.zynvora.flash_ticket_system.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class authController {

    public final RedisTemplate<String,String> redisTemplate;

    @PostMapping("/admin/check/{name}")
    public String adminCheck(@PathVariable String name) {
        redisTemplate.opsForValue().set("ADMIN", name);
        return "HELLO ADMIN THANKS FOR COMING :" + redisTemplate.opsForValue().get("ADMIN");
    }

    @PostMapping("/user/check/{name}")
    public String userCheck(@PathVariable String name) {
        redisTemplate.opsForValue().set("USER", name);
        return "HELLO USER THANKS FOR COMING :" + redisTemplate.opsForValue().get("USER");
    }
}
