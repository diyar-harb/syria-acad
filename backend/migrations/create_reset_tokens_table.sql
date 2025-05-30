CREATE TABLE IF NOT EXISTS reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used BOOLEAN DEFAULT FALSE,
    UNIQUE(token)
);

CREATE INDEX idx_reset_tokens_user_id ON reset_tokens(user_id);
CREATE INDEX idx_reset_tokens_token ON reset_tokens(token);
CREATE INDEX idx_reset_tokens_expires_at ON reset_tokens(expires_at); 