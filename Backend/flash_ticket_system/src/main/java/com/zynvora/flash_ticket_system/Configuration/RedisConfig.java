package com.zynvora.flash_ticket_system.Configuration;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {
    
// For localhost        
//     @Bean
//     public RedissonClient redissionClient(){
//         Config config = new Config();
//         config.useSingleServer()
//                 .setAddress("redis://localhost:6379");
//         return Redisson.create(config);
//     } 

     @Bean
    public RedissonClient redissionClient(){
        Config config = new Config();
        config.setUsername("default");
        config.setPassword("kpEXL8QCLb7wYnef5c2gjvNJkISP5Da9");
        config.useSingleServer()
                .setAddress("redis://farm-sunray-ink-21754.db.redis.io:13857")
                .setConnectionPoolSize(4)
                .setConnectionMinimumIdleSize(1);
        return Redisson.create(config);
    } 


     @Bean
    public RedisTemplate<String, Integer> redisTemplate(
            RedisConnectionFactory connectionFactory) {

        RedisTemplate<String, Integer> template = new RedisTemplate<>();

        template.setConnectionFactory(connectionFactory);

        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(
                new GenericJackson2JsonRedisSerializer()
        );

        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(
                new GenericJackson2JsonRedisSerializer()
        );

        template.afterPropertiesSet();

        return template;
    }
    
}
