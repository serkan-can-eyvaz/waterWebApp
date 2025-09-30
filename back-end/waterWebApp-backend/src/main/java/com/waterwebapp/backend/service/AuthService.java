package com.waterwebapp.backend.service;

import com.waterwebapp.backend.dto.LoginRequest;
import com.waterwebapp.backend.dto.LoginResponse;
import com.waterwebapp.backend.entity.User;
import com.waterwebapp.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    public LoginResponse authenticate(LoginRequest loginRequest) {
        try {
            Optional<User> optionalUser = userRepository.findByEmailAndIsActiveTrue(loginRequest.getEmail());
            
            if (!optionalUser.isPresent()) {
                return new LoginResponse(false, "Email adresi bulunamadı");
            }
            
            User user = optionalUser.get();
            
            // Basit şifre kontrolü (gerçek uygulamada hash kullanılmalı)
            if (!user.getPassword().equals(loginRequest.getPassword())) {
                return new LoginResponse(false, "Hatalı şifre");
            }
            
            // Token oluştur (basit UUID tabanlı)
            String token = generateToken(user);
            
            // Son giriş zamanını güncelle
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            return new LoginResponse(
                true,
                token,
                user.getEmail(),
                user.getFullName(),
                user.getRole().toString()
            );
            
        } catch (Exception e) {
            return new LoginResponse(false, "Giriş sırasında hata oluştu: " + e.getMessage());
        }
    }
    
    public boolean validateToken(String token) {
        try {
            // Token'ı decode et
            String decodedToken = new String(Base64.getDecoder().decode(token));
            String[] parts = decodedToken.split(":");
            
            if (parts.length != 2) {
                return false;
            }
            
            String email = parts[0];
            String tokenId = parts[1];
            
            Optional<User> optionalUser = userRepository.findByEmailAndIsActiveTrue(email);
            if (!optionalUser.isPresent()) {
                return false;
            }
            
            // Basit token kontrolü (gerçek uygulamada daha karmaşık olmalı)
            return tokenId != null && !tokenId.isEmpty();
            
        } catch (Exception e) {
            return false;
        }
    }
    
    public User getUserFromToken(String token) {
        try {
            String decodedToken = new String(Base64.getDecoder().decode(token));
            String[] parts = decodedToken.split(":");
            
            if (parts.length != 2) {
                return null;
            }
            
            String email = parts[0];
            Optional<User> optionalUser = userRepository.findByEmailAndIsActiveTrue(email);
            return optionalUser.orElse(null);
            
        } catch (Exception e) {
            return null;
        }
    }
    
    private String generateToken(User user) {
        String tokenId = UUID.randomUUID().toString();
        String tokenData = user.getEmail() + ":" + tokenId;
        return Base64.getEncoder().encodeToString(tokenData.getBytes());
    }
}
