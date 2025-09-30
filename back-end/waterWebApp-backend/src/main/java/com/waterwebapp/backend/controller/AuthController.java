package com.waterwebapp.backend.controller;

import com.waterwebapp.backend.dto.LoginRequest;
import com.waterwebapp.backend.dto.LoginResponse;
import com.waterwebapp.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.authenticate(loginRequest);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String token) {
        Map<String, Object> response = new HashMap<>();
        
        if (token == null || !token.startsWith("Bearer ")) {
            response.put("valid", false);
            response.put("message", "Geçersiz token formatı");
            return ResponseEntity.badRequest().body(response);
        }
        
        String actualToken = token.substring(7); // "Bearer " kısmını çıkar
        boolean isValid = authService.validateToken(actualToken);
        
        response.put("valid", isValid);
        response.put("message", isValid ? "Token geçerli" : "Token geçersiz");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUserInfo(@RequestHeader("Authorization") String token) {
        Map<String, Object> response = new HashMap<>();
        
        if (token == null || !token.startsWith("Bearer ")) {
            response.put("success", false);
            response.put("message", "Token bulunamadı");
            return ResponseEntity.badRequest().body(response);
        }
        
        String actualToken = token.substring(7);
        var user = authService.getUserFromToken(actualToken);
        
        if (user != null) {
            response.put("success", true);
            response.put("email", user.getEmail());
            response.put("fullName", user.getFullName());
            response.put("role", user.getRole().toString());
        } else {
            response.put("success", false);
            response.put("message", "Kullanıcı bulunamadı");
        }
        
        return ResponseEntity.ok(response);
    }
}
