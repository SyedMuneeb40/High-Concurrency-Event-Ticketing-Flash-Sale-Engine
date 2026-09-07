package com.zynvora.flash_ticket_system.Configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

   @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Project ki absolute root directory se absolute path generate karein
        String uploadDir = System.getProperty("user.dir") + File.separator + "Uploads" + File.separator;
        
        registry
            .addResourceHandler("/uploads/**")
            .addResourceLocations("file:" + uploadDir);
    }
}