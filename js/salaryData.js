export const DEGREE_TYPES = {
    MEDICAL_ENGINEERING_PHARMACY: 'MEDICAL_ENGINEERING_PHARMACY',
    OTHER_BACHELOR_1: 'OTHER_BACHELOR_1',
    OTHER_BACHELOR_2: 'OTHER_BACHELOR_2',
    DIPLOMA_OR_HIGH_SCHOOL_PLUS_2: 'DIPLOMA_OR_HIGH_SCHOOL_PLUS_2',
    HIGH_SCHOOL_PLUS_1: 'HIGH_SCHOOL_PLUS_1',
    MIDDLE_SCHOOL_PLUS_3: 'MIDDLE_SCHOOL_PLUS_3',
    HIGH_SCHOOL_ONLY: 'HIGH_SCHOOL_ONLY',
    MIDDLE_SCHOOL_PLUS_1: 'MIDDLE_SCHOOL_PLUS_1',
    MIDDLE_SCHOOL_ONLY: 'MIDDLE_SCHOOL_ONLY',
    BELOW_MIDDLE_PLUS_2: 'BELOW_MIDDLE_PLUS_2',
    BELOW_MIDDLE: 'BELOW_MIDDLE'
};

export const MARITAL_STATUS = {
    SINGLE: 'SINGLE',
    MARRIED: 'MARRIED'
};

export const POST_GRADUATE_ALLOWANCE = {
    NONE: 0,
    MASTER: 75,
    DOCTORATE: 150
};

export const WFS_ADDITIONAL = {
    COST_OF_LIVING: 120,
    BONUS: 50,
    INCREMENT: 50
};

export const DEGREE_DATA = {
    MEDICAL_ENGINEERING_PHARMACY: {
        socialAllowance: {
            SINGLE: 190,
            MARRIED: 278
        },
        degreeIncrement: 330,
        socialAllowanceIncrease: {
            SINGLE: 50,
            MARRIED: 70
        }
    },

    OTHER_BACHELOR_1: {
        socialAllowance: {
            SINGLE: 190,
            MARRIED: 278
        },
        degreeIncrement: 280,
        socialAllowanceIncrease: {
            SINGLE: 50,
            MARRIED: 70
        }
    },

    OTHER_BACHELOR_2: {
        socialAllowance: {
            SINGLE: 190,
            MARRIED: 278
        },
        degreeIncrement: 230,
        socialAllowanceIncrease: {
            SINGLE: 50,
            MARRIED: 70
        }
    },

    DIPLOMA_OR_HIGH_SCHOOL_PLUS_2: {
        socialAllowance: {
            SINGLE: 169,
            MARRIED: 250
        },
        degreeIncrement: 190,
        socialAllowanceIncrease: {
            SINGLE: 50,
            MARRIED: 63
        }
    },

    HIGH_SCHOOL_PLUS_1: {
        socialAllowance: {
            SINGLE: 161,
            MARRIED: 242
        },
        degreeIncrement: 140,
        socialAllowanceIncrease: {
            SINGLE: 50,
            MARRIED: 61
        }
    },

    MIDDLE_SCHOOL_PLUS_3: {
        socialAllowance: {
            SINGLE: 161,
            MARRIED: 242
        },
        degreeIncrement: 140,
        socialAllowanceIncrease: {
            SINGLE: 50,
            MARRIED: 61
        }
    },

    HIGH_SCHOOL_ONLY: {
        socialAllowance: {
            SINGLE: 147,
            MARRIED: 222
        },
        degreeIncrement: 140,
        socialAllowanceIncrease: {
            SINGLE: 50,
            MARRIED: 56
        }
    },

    MIDDLE_SCHOOL_PLUS_1: {
        socialAllowance: {
            SINGLE: 161,
            MARRIED: 242
        },
        degreeIncrement: 100,
        socialAllowanceIncrease: {
            SINGLE: 50,
            MARRIED: 61
        }
    },

    MIDDLE_SCHOOL_ONLY: {
        socialAllowance: {
            SINGLE: 141,
            MARRIED: 216
        },
        degreeIncrement: 100,
        socialAllowanceIncrease: {
            SINGLE: 50,
            MARRIED: 54
        }
    },

    BELOW_MIDDLE_PLUS_2: {
        socialAllowance: {
            SINGLE: 161,
            MARRIED: 242
        },
        degreeIncrement: 50,
        socialAllowanceIncrease: {
            SINGLE: 50,
            MARRIED: 61
        }
    },

    BELOW_MIDDLE: {
        socialAllowance: {
            SINGLE: 136,
            MARRIED: 211
        },
        degreeIncrement: 50,
        socialAllowanceIncrease: {
            SINGLE: 50,
            MARRIED: 53
        }
    }
};