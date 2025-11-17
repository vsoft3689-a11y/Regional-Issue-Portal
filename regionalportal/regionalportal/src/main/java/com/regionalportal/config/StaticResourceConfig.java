package com.regionalportal.config;



import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 🌐 StaticResourceConfig — exposes uploaded files for frontend access.
 */
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // ✅ Serve all files inside /uploads/ folder via URL: http://localhost:8000/uploads/**
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/");

        System.out.println("🟢 StaticResourceConfig active: serving files from /uploads/");
    }
}
