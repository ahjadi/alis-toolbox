
export const DegreeType = {
    MEDICAL_ENGINEERING_PHARMACY: 'MEDICAL_ENGINEERING_PHARMACY', // طب - صيدلة - هندسة
    OTHER_BACHELOR_1: 'OTHER_BACHELOR_1', // قانون - نظم المعلومات - إحصاء - اقتصاد - تمريض - تمويل - تمويل منشآت مالية - إدارة مالية - تأمين - تجارة خارجية - علوم مصرفية - تعاون - تدريس
    OTHER_BACHELOR_2: 'OTHER_BACHELOR_2', // باقي التخصصات الجامعية
    DIPLOMA_OR_HIGH_SCHOOL_PLUS_2: 'DIPLOMA_OR_HIGH_SCHOOL_PLUS_2', // دبلوم أو ثانوية عامة + دورة تدريبية سنتين
    HIGH_SCHOOL_PLUS_1: 'HIGH_SCHOOL_PLUS_1', // ثانوية + دورة سنة أو خبرة معادلة
    MIDDLE_SCHOOL_PLUS_3: 'MIDDLE_SCHOOL_PLUS_3', // متوسط + دورة 3 سنوات
    HIGH_SCHOOL_ONLY: 'HIGH_SCHOOL_ONLY', // ثانوية عامة فقط
    MIDDLE_SCHOOL_PLUS_1: 'MIDDLE_SCHOOL_PLUS_1', // متوسط + دورة سنة أو خبرة معادلة
    MIDDLE_SCHOOL_ONLY: 'MIDDLE_SCHOOL_ONLY', // متوسط فقط
    BELOW_MIDDLE_PLUS_2: 'BELOW_MIDDLE_PLUS_2', // مادون المتوسط + دورة سنتين
    BELOW_MIDDLE: 'BELOW_MIDDLE' // مادون المتوسط فقط
};

export const MaritalStatus = {
    SINGLE: 'SINGLE',
    MARRIED: 'MARRIED'
};

export const PostGradStatus = {
    No: 0,
    MASTER: 75,
    DOCTORATE: 150
};
// Degree data
export const DEGREE_DATA = {
    MEDICAL_ENGINEERING_PHARMACY: {
        social_allowance: { SINGLE: 190, MARRIED: 278 },
        additional: {
            cost_of_living: 120,    // الغلاء (Cost of Living)
            bonus: 50,              // المكافأة (Bonus)
            increment: 50           // الزيادة (Increment)
        },
        degree_increment: 330,
        social_allowance_increase: { SINGLE: 50, MARRIED: 70 }
    },
    OTHER_BACHELOR_1: {
        social_allowance: { SINGLE: 190, MARRIED: 278 },
        additional: {
            cost_of_living: 120,    // الغلاء (Cost of Living)
            bonus: 50,              // المكافأة (Bonus)
            increment: 50           // الزيادة (Increment)
        },
        degree_increment: 280,
        social_allowance_increase: { SINGLE: 50, MARRIED: 70 }
    },
    OTHER_BACHELOR_2: {
        social_allowance: { SINGLE: 190, MARRIED: 278 },
        additional: {
            cost_of_living: 120,    // الغلاء (Cost of Living)
            bonus: 50,              // المكافأة (Bonus)
            increment: 50           // الزيادة (Increment)
        },
        degree_increment: 230,
        social_allowance_increase: { SINGLE: 50, MARRIED: 70 }
    },
    DIPLOMA_OR_HIGH_SCHOOL_PLUS_2: {
        social_allowance: { SINGLE: 169, MARRIED: 250 },
        additional: {
            cost_of_living: 120,    // الغلاء (Cost of Living)
            bonus: 50,              // المكافأة (Bonus)
            increment: 50           // الزيادة (Increment)
        },
        degree_increment: 190,
        social_allowance_increase: { SINGLE: 50, MARRIED: 63 }
    },
    HIGH_SCHOOL_PLUS_1: {
        social_allowance: { SINGLE: 161, MARRIED: 242 },
        additional: {
            cost_of_living: 120,    // الغلاء (Cost of Living)
            bonus: 50,              // المكافأة (Bonus)
            increment: 50           // الزيادة (Increment)
        },
        degree_increment: 140,
        social_allowance_increase: { SINGLE: 50, MARRIED: 61 }
    },
    MIDDLE_SCHOOL_PLUS_3: {
        social_allowance: { SINGLE: 161, MARRIED: 242 },
        additional: {
            cost_of_living: 120,    // الغلاء (Cost of Living)
            bonus: 50,              // المكافأة (Bonus)
            increment: 50           // الزيادة (Increment)
        },
        degree_increment: 140,
        social_allowance_increase: { SINGLE: 50, MARRIED: 61 }
    },
    HIGH_SCHOOL_ONLY: {
        social_allowance: { SINGLE: 147, MARRIED: 222 },
        additional: {
            cost_of_living: 120,    // الغلاء (Cost of Living)
            bonus: 50,              // المكافأة (Bonus)
            increment: 50           // الزيادة (Increment)
        },
        degree_increment: 140,
        social_allowance_increase: { SINGLE: 50, MARRIED: 56 }
    },
    MIDDLE_SCHOOL_PLUS_1: {
        social_allowance: { SINGLE: 161, MARRIED: 242 },
        additional: {
            cost_of_living: 120,    // الغلاء (Cost of Living)
            bonus: 50,              // المكافأة (Bonus)
            increment: 50           // الزيادة (Increment)
        },
        degree_increment: 100,
        social_allowance_increase: { SINGLE: 50, MARRIED: 61 }
    },
    MIDDLE_SCHOOL_ONLY: {
        social_allowance: { SINGLE: 141, MARRIED: 216 },
        additional: {
            cost_of_living: 120,    // الغلاء (Cost of Living)
            bonus: 50,              // المكافأة (Bonus)
            increment: 50           // الزيادة (Increment)
        },
        degree_increment: 100,
        social_allowance_increase: { SINGLE: 50, MARRIED: 54 }
    },
    BELOW_MIDDLE_PLUS_2: {
        social_allowance: { SINGLE: 161, MARRIED: 242 },
        additional: {
            cost_of_living: 120,    // الغلاء (Cost of Living)
            bonus: 50,              // المكافأة (Bonus)
            increment: 50           // الزيادة (Increment)
        },
        degree_increment: 50,
        social_allowance_increase: { SINGLE: 50, MARRIED: 61 }
    },
    BELOW_MIDDLE: {
        social_allowance: { SINGLE: 136, MARRIED: 211 },
        additional: {
            cost_of_living: 120,    // الغلاء (Cost of Living)
            bonus: 50,              // المكافأة (Bonus)
            increment: 50           // الزيادة (Increment)
        },
        degree_increment: 50,
        social_allowance_increase: { SINGLE: 50, MARRIED: 53 }
    }
};