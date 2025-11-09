package com.dlrs.controller;

import com.dlrs.dto.BlockResponse;
import com.dlrs.dto.ChainVerificationResponse;
import com.dlrs.service.BlockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blocks")
@CrossOrigin(origins = "*")
public class BlockController {

    @Autowired
    private BlockService blockService;

    @GetMapping
    public ResponseEntity<List<BlockResponse>> getAllBlocks() {
        List<BlockResponse> blocks = blockService.getAllBlocks();
        return ResponseEntity.ok(blocks);
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<BlockResponse>> getBlocksByProperty(@PathVariable Long propertyId) {
        List<BlockResponse> blocks = blockService.getBlocksByPropertyId(propertyId);
        return ResponseEntity.ok(blocks);
    }

    @PostMapping("/verify")
    public ResponseEntity<ChainVerificationResponse> verifyChain(
            @RequestParam(required = false) Long propertyId) {
        ChainVerificationResponse response = blockService.verifyChain(propertyId);
        return ResponseEntity.ok(response);
    }
}

