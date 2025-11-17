package com.regionalportal.dto;

import com.regionalportal.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {

    private String username;
    private Role role;
    private String token;
}
