package com.dlrs.util;

import com.dlrs.model.Block;
import com.dlrs.model.Transaction;
import org.springframework.stereotype.Component;

import java.security.MessageDigest;
import java.time.LocalDateTime;

@Component
public class BlockchainUtil {
    private static final String GENESIS_HASH = "0";

    public String calculateDataHash(Transaction transaction) {
        try {
            // Create a simplified JSON representation to avoid circular references
            String transactionJson = String.format(
                "{\"id\":%d,\"propertyId\":%d,\"buyerId\":%d,\"sellerId\":%d,\"amount\":%s,\"status\":\"%s\"}",
                transaction.getId(),
                transaction.getProperty().getId(),
                transaction.getBuyer().getId(),
                transaction.getSeller().getId(),
                transaction.getAmount().toString(),
                transaction.getStatus().name()
            );
            return sha256(transactionJson);
        } catch (Exception e) {
            throw new RuntimeException("Error calculating data hash", e);
        }
    }

    public String calculateCurrentHash(Integer blockIndex, LocalDateTime timestamp, 
                                       Transaction transaction, String previousHash, Long nonce) {
        try {
            // Create a simplified JSON representation to avoid circular references
            String transactionJson = String.format(
                "{\"id\":%d,\"propertyId\":%d,\"buyerId\":%d,\"sellerId\":%d,\"amount\":%s,\"status\":\"%s\"}",
                transaction.getId(),
                transaction.getProperty().getId(),
                transaction.getBuyer().getId(),
                transaction.getSeller().getId(),
                transaction.getAmount().toString(),
                transaction.getStatus().name()
            );
            String data = blockIndex + timestamp.toString() + transactionJson + previousHash + nonce;
            return sha256(data);
        } catch (Exception e) {
            throw new RuntimeException("Error calculating current hash", e);
        }
    }

    public String getGenesisHash() {
        return GENESIS_HASH;
    }

    public String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes("UTF-8"));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating SHA-256 hash", e);
        }
    }

    public boolean verifyBlock(Block block, Block previousBlock) {
        // Verify data hash
        String calculatedDataHash = calculateDataHash(block.getTransaction());
        if (!calculatedDataHash.equals(block.getDataHash())) {
            return false;
        }

        // Verify current hash
        String calculatedCurrentHash = calculateCurrentHash(
                block.getBlockIndex(),
                block.getTimestamp(),
                block.getTransaction(),
                block.getPreviousHash(),
                block.getNonce()
        );
        if (!calculatedCurrentHash.equals(block.getCurrentHash())) {
            return false;
        }

        // Verify previous hash link
        if (previousBlock != null) {
            if (!block.getPreviousHash().equals(previousBlock.getCurrentHash())) {
                return false;
            }
        } else {
            // Genesis block
            if (!block.getPreviousHash().equals(GENESIS_HASH)) {
                return false;
            }
        }

        return true;
    }
}

