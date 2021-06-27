enum UserRole {
    ADMIN,
    SELLER,
    ACCOUNTANT,
}

enum UserStatus {
    /**
     * User just created account
     * When user have this status
     * User need activate this accout
     */
    JUST_CREATED = "just_created",

    /**
     * User just activated
     * When user have this status
     * User need update information this account
     */
    JUST_ACTIVATED = "just_activated",

    /**
     * User updated information for this account
     * User can user this account
     */
    UPDATED_INFORMATION = "updated_information",

    /**
     * User has been block account
     * This account cannot use
     */
    BLOCKED = "blocked",

    /**
     * User deleted this account
     */
    DELETED = "deleted",
}

export { UserRole, UserStatus };
