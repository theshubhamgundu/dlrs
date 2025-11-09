package com.dlrs.dto;

import com.dlrs.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private Role role;
    private String fullName;
    private String email;
}

