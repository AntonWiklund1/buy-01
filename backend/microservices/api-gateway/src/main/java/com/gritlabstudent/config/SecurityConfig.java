package com.gritlabstudent.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable()
                .authorizeExchange(exchanges -> exchanges
                    // Publicly accessible paths (no authentication required)
                    .pathMatchers("/api/auth/**").permitAll()

                    // User-specific endpoints
                    .pathMatchers(HttpMethod.POST, "/api/users/**").permitAll()
                    .pathMatchers(HttpMethod.GET, "/api/users","/api/users/**").permitAll()
                    .pathMatchers(HttpMethod.DELETE, "/api/users/**").permitAll()
                    .pathMatchers(HttpMethod.PUT, "/api/users/**").permitAll()

                    // Product-specific endpoints
                    .pathMatchers(HttpMethod.POST, "/api/products").permitAll()
                    .pathMatchers(HttpMethod.GET, "/api/products", "/api/products/**").permitAll()
                    .pathMatchers(HttpMethod.DELETE, "/api/products/**").permitAll()
                    .pathMatchers(HttpMethod.PUT, "/api/products/**").permitAll()

                    // Media-specific endpoints
                    .pathMatchers(HttpMethod.GET, "/media", "/media/**").permitAll()
                    .pathMatchers(HttpMethod.POST, "/media/upload").permitAll()
                    .pathMatchers(HttpMethod.DELETE, "/media/**").permitAll()

                    // All other requests require authentication
                    .anyExchange().authenticated()
                ));

        return http.build();
    }
}