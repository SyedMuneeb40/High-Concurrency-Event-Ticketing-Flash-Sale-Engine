package com.zynvora.flash_ticket_system.Controller;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class userController {
    public final RedisTemplate<String,String> redisTemplate;

    @PostMapping("{name}")
    public String userCheck(@PathVariable String name) {
        redisTemplate.opsForValue().set("USER", name);
        return "HELLO USER THANKS FOR COMING :" + redisTemplate.opsForValue().get("USER");
    }
}
