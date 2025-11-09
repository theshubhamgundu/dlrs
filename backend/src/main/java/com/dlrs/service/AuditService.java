package com.dlrs.service;

import com.dlrs.model.AuditLog;
import com.dlrs.model.User;
import com.dlrs.repository.AuditLogRepository;
import com.dlrs.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void logAction(Long userId, String action, String details) {
        AuditLog auditLog = new AuditLog();
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            auditLog.setUser(user);
        }
        auditLog.setAction(action);
        auditLog.setDetails(details);
        auditLogRepository.save(auditLog);
    }

    public void logAction(String action, String details) {
        logAction(null, action, details);
    }
}

