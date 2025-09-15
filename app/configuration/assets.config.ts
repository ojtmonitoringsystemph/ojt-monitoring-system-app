// Image Categories
export enum ImageCategory {
    LOGOS = "logos",
    ABOUT_SLIDER = "about-slider",
    CARESPAN_TRAINING = "carespan-training",
    DOCTOR_PORTAL = "doctor-portal",
    KONSULTA = "konsulta",
    MAYOR = "mayor",
    MOA_SUAL = "moa-sual",
    ORIENTATION = "orientation",
    PARTNERS = "partners"
}

// Image Keys
export enum ImageKey {
    // Logos
    LOGO_WITH_BG = "FTCC-Health-Tech-Clinic-with-bg",
    LOGO_WITHOUT_BG = "FTCC-Health-Tech-Clinic",
    CLINIC_LOGO_JPG = "HealthTechClinicLogo-jpg",
    CLINIC_LOGO_PNG = "HealthTechClinicLogo-png",

    // About Slider
    ABOUT_MOA_ALPHASURE = "MOA-AlphaSure",
    ABOUT_MOA_CARETECH = "MOA-CareTech",
    ABOUT_MOA_SAN_NARCISO = "MOA-SanNarciso",
    ABOUT_MOA_SUAL = "MOA-Sual",
    ABOUT_MOA_IPHARMA = "MOA-iPharma",

    // CareSpan Training
    CARESPAN_1 = "CareSpan Training-1",
    CARESPAN_2 = "CareSpan Training-2",
    CARESPAN_3 = "CareSpan Training-3",
    CARESPAN_4 = "CareSpan Training-4",
    CARESPAN_5 = "CareSpan Training-5",

    // Doctor Portal
    DOCTOR_APPOINTMENTS = "appointments",
    DOCTOR_DASHBOARD = "dashboard",
    DOCTOR_HISTORY = "history",
    DOCTOR_QUEUE = "queue",

    // Konsulta Pitogo
    KONSULTA_PITOGO_1 = "KONSULTA-PITOGO-1",
    KONSULTA_PITOGO_2 = "KONSULTA-PITOGO-2",
    KONSULTA_PITOGO_3 = "KONSULTA-PITOGO-3",
    KONSULTA_PITOGO_4 = "KONSULTA-PITOGO-4",

    // Konsulta Zambales
    KONSULTA_ZAMBALES_1 = "KONSULTA-ZAMBALES-1",
    KONSULTA_ZAMBALES_2 = "KONSULTA-ZAMBALES-2",
    KONSULTA_ZAMBALES_3 = "KONSULTA-ZAMBALES-3",
    KONSULTA_ZAMBALES_4 = "KONSULTA-ZAMBALES-4",
    KONSULTA_ZAMBALES_5 = "KONSULTA-ZAMBALES-5",

    // Mayor Artenio
    MAYOR_ARTENIO_1 = "Mayor Artenio Mamburao of Macalelon Quezon 1",
    MAYOR_ARTENIO_2 = "Mayor Artenio Mamburao of Macalelon Quezon 2",
    MAYOR_ARTENIO_3 = "Mayor Artenio Mamburao of Macalelon Quezon 3",
    MAYOR_ARTENIO_4 = "Mayor Artenio Mamburao of Macalelon Quezon 4",

    // Mayor Web
    MAYOR_WEB_1 = "Mayor Web Letargo of Gumaca and Councilors 1",

    // MOA Sual
    MOA_SUAL_1 = "MOA-SUAL-1",
    MOA_SUAL_2 = "MOA-SUAL-2",
    MOA_SUAL_3 = "MOA-SUAL-3",
    MOA_SUAL_4 = "MOA-SUAL-4",
    MOA_SUAL_5 = "MOA-SUAL-5",
    MOA_SUAL_6 = "MOA-SUAL-6",
    MOA_SUAL_7 = "MOA-SUAL-7",
    MOA_SUAL_8 = "MOA-SUAL-8",
    MOA_SUAL_9 = "MOA-SUAL-9",

    // Orientation Nueva Ecija
    ORIENTATION_NE_1 = "ORIENTATION-NUEVA-ECIJA-1",
    ORIENTATION_NE_2 = "ORIENTATION-NUEVA-ECIJA-2",
    ORIENTATION_NE_3 = "ORIENTATION-NUEVA-ECIJA-3",
    ORIENTATION_NE_4 = "ORIENTATION-NUEVA-ECIJA-4",
    ORIENTATION_NE_5 = "ORIENTATION-NUEVA-ECIJA-5",
    ORIENTATION_NE_6 = "ORIENTATION-NUEVA-ECIJA-6",

    // Partners
    PARTNER_BIDS_AWARD = "BIDS-AND-AWARD",
    PARTNER_SEAL_BASILAN = "Ph_seal_basilan",
    PARTNER_SEAL_ILOCOS = "Ph_seal_ilocos_sur",
    PARTNER_SEAL_PALAWAN = "Ph_seal_palawan",
    PARTNER_MOUNTAIN = "mountain-prov"
}

// Image metadata interface
interface ImageMetadata {
    category: ImageCategory;
    extension: string;
}

// Only include keys with actual metadata
const imageMetadata: Partial<Record<ImageKey, ImageMetadata>> = {
    // Logos
    [ImageKey.LOGO_WITH_BG]: { category: ImageCategory.LOGOS, extension: 'png' },
    [ImageKey.LOGO_WITHOUT_BG]: { category: ImageCategory.LOGOS, extension: 'png' },
    [ImageKey.CLINIC_LOGO_JPG]: { category: ImageCategory.LOGOS, extension: 'jpg' },
    [ImageKey.CLINIC_LOGO_PNG]: { category: ImageCategory.LOGOS, extension: 'png' },
    // About Slider
    [ImageKey.ABOUT_MOA_ALPHASURE]: { category: ImageCategory.ABOUT_SLIDER, extension: 'jpg' },
    [ImageKey.ABOUT_MOA_CARETECH]: { category: ImageCategory.ABOUT_SLIDER, extension: 'jpg' },
    [ImageKey.ABOUT_MOA_SAN_NARCISO]: { category: ImageCategory.ABOUT_SLIDER, extension: 'jpg' },
    [ImageKey.ABOUT_MOA_SUAL]: { category: ImageCategory.ABOUT_SLIDER, extension: 'jpg' },
    [ImageKey.ABOUT_MOA_IPHARMA]: { category: ImageCategory.ABOUT_SLIDER, extension: 'jpg' },
    // CareSpan Training
    [ImageKey.CARESPAN_1]: { category: ImageCategory.CARESPAN_TRAINING, extension: 'jpg' },
    [ImageKey.CARESPAN_2]: { category: ImageCategory.CARESPAN_TRAINING, extension: 'jpg' },
    [ImageKey.CARESPAN_3]: { category: ImageCategory.CARESPAN_TRAINING, extension: 'jpg' },
    [ImageKey.CARESPAN_4]: { category: ImageCategory.CARESPAN_TRAINING, extension: 'jpg' },
    [ImageKey.CARESPAN_5]: { category: ImageCategory.CARESPAN_TRAINING, extension: 'jpg' },
    // Doctor Portal
    [ImageKey.DOCTOR_APPOINTMENTS]: { category: ImageCategory.DOCTOR_PORTAL, extension: 'png' },
    [ImageKey.DOCTOR_DASHBOARD]: { category: ImageCategory.DOCTOR_PORTAL, extension: 'png' },
    [ImageKey.DOCTOR_HISTORY]: { category: ImageCategory.DOCTOR_PORTAL, extension: 'png' },
    [ImageKey.DOCTOR_QUEUE]: { category: ImageCategory.DOCTOR_PORTAL, extension: 'png' },
    // Konsulta Pitogo
    [ImageKey.KONSULTA_PITOGO_1]: { category: ImageCategory.KONSULTA, extension: 'jpg' },
    [ImageKey.KONSULTA_PITOGO_2]: { category: ImageCategory.KONSULTA, extension: 'jpg' },
    [ImageKey.KONSULTA_PITOGO_3]: { category: ImageCategory.KONSULTA, extension: 'jpg' },
    [ImageKey.KONSULTA_PITOGO_4]: { category: ImageCategory.KONSULTA, extension: 'jpg' },
    // Konsulta Zambales
    [ImageKey.KONSULTA_ZAMBALES_1]: { category: ImageCategory.KONSULTA, extension: 'jpg' },
    [ImageKey.KONSULTA_ZAMBALES_2]: { category: ImageCategory.KONSULTA, extension: 'jpg' },
    [ImageKey.KONSULTA_ZAMBALES_3]: { category: ImageCategory.KONSULTA, extension: 'jpg' },
    [ImageKey.KONSULTA_ZAMBALES_4]: { category: ImageCategory.KONSULTA, extension: 'jpg' },
    [ImageKey.KONSULTA_ZAMBALES_5]: { category: ImageCategory.KONSULTA, extension: 'jpg' },
    // Mayor Artenio
    [ImageKey.MAYOR_ARTENIO_1]: { category: ImageCategory.MAYOR, extension: 'jpg' },
    [ImageKey.MAYOR_ARTENIO_2]: { category: ImageCategory.MAYOR, extension: 'jpg' },
    [ImageKey.MAYOR_ARTENIO_3]: { category: ImageCategory.MAYOR, extension: 'jpg' },
    [ImageKey.MAYOR_ARTENIO_4]: { category: ImageCategory.MAYOR, extension: 'jpg' },
    [ImageKey.MAYOR_WEB_1]: { category: ImageCategory.MAYOR, extension: 'jpg' },
    // MOA Sual (add as needed)
    [ImageKey.MOA_SUAL_1]: { category: ImageCategory.MOA_SUAL, extension: 'jpg' },
    [ImageKey.MOA_SUAL_2]: { category: ImageCategory.MOA_SUAL, extension: 'jpg' },
    [ImageKey.MOA_SUAL_3]: { category: ImageCategory.MOA_SUAL, extension: 'jpg' },
    [ImageKey.MOA_SUAL_4]: { category: ImageCategory.MOA_SUAL, extension: 'jpg' },
    [ImageKey.MOA_SUAL_5]: { category: ImageCategory.MOA_SUAL, extension: 'jpg' },
    [ImageKey.MOA_SUAL_6]: { category: ImageCategory.MOA_SUAL, extension: 'jpg' },
    [ImageKey.MOA_SUAL_7]: { category: ImageCategory.MOA_SUAL, extension: 'jpg' },
    [ImageKey.MOA_SUAL_8]: { category: ImageCategory.MOA_SUAL, extension: 'jpg' },
    [ImageKey.MOA_SUAL_9]: { category: ImageCategory.MOA_SUAL, extension: 'jpg' },
    // Orientation Nueva Ecija (add as needed)
    [ImageKey.ORIENTATION_NE_1]: { category: ImageCategory.ORIENTATION, extension: 'jpg' },
    [ImageKey.ORIENTATION_NE_2]: { category: ImageCategory.ORIENTATION, extension: 'jpg' },
    [ImageKey.ORIENTATION_NE_3]: { category: ImageCategory.ORIENTATION, extension: 'jpg' },
    [ImageKey.ORIENTATION_NE_4]: { category: ImageCategory.ORIENTATION, extension: 'jpg' },
    [ImageKey.ORIENTATION_NE_5]: { category: ImageCategory.ORIENTATION, extension: 'jpg' },
    [ImageKey.ORIENTATION_NE_6]: { category: ImageCategory.ORIENTATION, extension: 'jpg' },
    // Partners (add as needed)
    [ImageKey.PARTNER_BIDS_AWARD]: { category: ImageCategory.PARTNERS, extension: 'png' },
    [ImageKey.PARTNER_SEAL_BASILAN]: { category: ImageCategory.PARTNERS, extension: 'png' },
    [ImageKey.PARTNER_SEAL_ILOCOS]: { category: ImageCategory.PARTNERS, extension: 'png' },
    [ImageKey.PARTNER_SEAL_PALAWAN]: { category: ImageCategory.PARTNERS, extension: 'png' },
    [ImageKey.PARTNER_MOUNTAIN]: { category: ImageCategory.PARTNERS, extension: 'png' },
};

// Helper function to get image path
export function getImagePath(key: ImageKey): string {
    const metadata = imageMetadata[key];
    if (!metadata) {
        return '/assets/imgs/ftcc-logo.png'; // fallback
    }
    const { category, extension } = metadata;
    if (category === ImageCategory.LOGOS) {
        return `/assets/imgs/${key}.${extension}`;
    }
    return `/assets/imgs/${category}/${key}.${extension}`;
}

// Helper function to get all images in a category
export function getCategoryImages(category: ImageCategory): ImageKey[] {
    return Object.entries(imageMetadata)
        .filter(([_, meta]) => meta && meta.category === category)
        .map(([key]) => key as ImageKey);
}

// Root level images
export const RootImages = {
    FTCC_HEALTH_TECH_CLINIC: {
        WITH_BG: require('../assets/imgs/FTCC-Health-Tech-Clinic-with-bg.png'),
        WITHOUT_BG: require('../assets/imgs/FTCC-Health-Tech-Clinic.png')
    },
    HEALTH_TECH_CLINIC_LOGO: {
        JPG: require('../assets/imgs/HealthTechClinicLogo.jpg'),
        PNG: require('../assets/imgs/HealthTechClinicLogo.png')
    }
};

// About Slider Images
export const AboutSliderImages = {
    MOA: {
        ALPHA_SURE: require('../assets/imgs/about-slider/MOA-AlphaSure.jpg'),
        CARE_TECH: require('../assets/imgs/about-slider/MOA-CareTech.jpg'),
        SAN_NARCISO: require('../assets/imgs/about-slider/MOA-SanNarciso.jpg'),
        SUAL: require('../assets/imgs/about-slider/MOA-Sual.jpg'),
        IPHARMA: require('../assets/imgs/about-slider/MOA-iPharma.jpg')
    }
};

// CareSpan Training Images
export const CareSpanImages = {
    TRAINING: {
        IMAGE_1: require('../assets/imgs/carespan.training/CareSpan Training-1.jpg'),
        IMAGE_2: require('../assets/imgs/carespan.training/CareSpan Training-2.jpg'),
        IMAGE_3: require('../assets/imgs/carespan.training/CareSpan Training-3.jpg'),
        IMAGE_4: require('../assets/imgs/carespan.training/CareSpan Training-4.jpg'),
        IMAGE_5: require('../assets/imgs/carespan.training/CareSpan Training-5.jpg')
    }
};

// Doctor Portal Images
export const DoctorPortalImages = {
    APPOINTMENTS: require('../assets/imgs/doctor-portal/appointments.png'),
    DASHBOARD: require('../assets/imgs/doctor-portal/dashboard.png'),
    HISTORY: require('../assets/imgs/doctor-portal/history.png'),
    QUEUE: require('../assets/imgs/doctor-portal/queue.png')
};

// Konsulta Images
export const KonsultaImages = {
    PITOGO: {
        IMAGE_1: require('../assets/imgs/konsulta.pitogo/KONSULTA-PITOGO-1.jpg'),
        IMAGE_2: require('../assets/imgs/konsulta.pitogo/KONSULTA-PITOGO-2.jpg'),
        IMAGE_3: require('../assets/imgs/konsulta.pitogo/KONSULTA-PITOGO-3.jpg'),
        IMAGE_4: require('../assets/imgs/konsulta.pitogo/KONSULTA-PITOGO-4.jpg')
    },
    ZAMBALES: {
        IMAGE_1: require('../assets/imgs/konsulta.zambales/KONSULTA-ZAMBALES-1.jpg'),
        IMAGE_2: require('../assets/imgs/konsulta.zambales/KONSULTA-ZAMBALES-2.jpg'),
        IMAGE_3: require('../assets/imgs/konsulta.zambales/KONSULTA-ZAMBALES-3.jpg'),
        IMAGE_4: require('../assets/imgs/konsulta.zambales/KONSULTA-ZAMBALES-4.jpg'),
        IMAGE_5: require('../assets/imgs/konsulta.zambales/KONSULTA-ZAMBALES-5.jpg')
    }
};

// Mayor Images
export const MayorImages = {
    ARTENIO: {
        IMAGE_1: require('../assets/imgs/mayor.artenio/Mayor Artenio Mamburao of Macalelon Quezon 1.jpg'),
        IMAGE_2: require('../assets/imgs/mayor.artenio/Mayor Artenio Mamburao of Macalelon Quezon 2.jpg'),
        IMAGE_3: require('../assets/imgs/mayor.artenio/Mayor Artenio Mamburao of Macalelon Quezon 3.jpg'),
        IMAGE_4: require('../assets/imgs/mayor.artenio/Mayor Artenio Mamburao of Macalelon Quezon 4.jpg')
    },
    WEB: {
        IMAGE_1: require('../assets/imgs/mayor.web/Mayor Web Letargo of Gumaca and Councilors 1.jpg'),
        IMAGE_2: require('../assets/imgs/mayor.web/Mayor Web Letargo of Gumaca and Councilors 2.jpg')
    }
};

// MOA Sual Images
export const MoaSualImages = {
    IMAGE_1: require('../assets/imgs/moa.sual/MOA-SUAL-1.jpg'),
    IMAGE_2: require('../assets/imgs/moa.sual/MOA-SUAL-2.jpg'),
    IMAGE_3: require('../assets/imgs/moa.sual/MOA-SUAL-3.jpg'),
    IMAGE_4: require('../assets/imgs/moa.sual/MOA-SUAL-4.jpg'),
    IMAGE_5: require('../assets/imgs/moa.sual/MOA-SUAL-5.jpg'),
    IMAGE_6: require('../assets/imgs/moa.sual/MOA-SUAL-6.jpg'),
    IMAGE_7: require('../assets/imgs/moa.sual/MOA-SUAL-7.jpg'),
    IMAGE_8: require('../assets/imgs/moa.sual/MOA-SUAL-8.jpg'),
    IMAGE_9: require('../assets/imgs/moa.sual/MOA-SUAL-9.jpg')
};

// Orientation Nueva Ecija Images
export const OrientationImages = {
    NUEVA_ECIJA: {
        IMAGE_1: require('../assets/imgs/orientation.nueva.ecija/ORIENTATION-NUEVA-ECIJA-1.jpg'),
        IMAGE_2: require('../assets/imgs/orientation.nueva.ecija/ORIENTATION-NUEVA-ECIJA-2.jpg'),
        IMAGE_3: require('../assets/imgs/orientation.nueva.ecija/ORIENTATION-NUEVA-ECIJA-3.jpg'),
        IMAGE_4: require('../assets/imgs/orientation.nueva.ecija/ORIENTATION-NUEVA-ECIJA-4.jpg'),
        IMAGE_5: require('../assets/imgs/orientation.nueva.ecija/ORIENTATION-NUEVA-ECIJA-5.jpg'),
        IMAGE_6: require('../assets/imgs/orientation.nueva.ecija/ORIENTATION-NUEVA-ECIJA-6.jpg')
    }
};

// Partner Images
export const PartnerImages = {
    BIDS_AND_AWARD: require('../assets/imgs/partners/BIDS-AND-AWARD.png'),
    SEALS: {
        BASILAN: require('../assets/imgs/partners/Ph_seal_basilan.png'),
        ILOCOS_SUR: require('../assets/imgs/partners/Ph_seal_ilocos_sur.png'),
        PALAWAN: require('../assets/imgs/partners/Ph_seal_palawan.png')
    },
    MOUNTAIN_PROVINCE: require('../assets/imgs/partners/mountain-prov.png')
};

// Export all image categories
export const Images = {
    ROOT: RootImages,
    ABOUT_SLIDER: AboutSliderImages,
    CARESPAN: CareSpanImages,
    DOCTOR_PORTAL: DoctorPortalImages,
    KONSULTA: KonsultaImages,
    MAYOR: MayorImages,
    MOA_SUAL: MoaSualImages,
    ORIENTATION: OrientationImages,
    PARTNERS: PartnerImages
};

// Type for image paths
export type ImagePath = string;

// Helper function to get image path with type safety
export function getImage(category: keyof typeof Images, ...keys: string[]): ImagePath {
    let current: any = Images[category];
    for (const key of keys) {
        if (current[key] === undefined) {
            throw new Error(`Invalid image path: ${category}/${keys.join('/')}`);
        }
        current = current[key];
    }
    return current;
}