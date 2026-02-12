import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.contactMessage.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.branchService.deleteMany();
    await prisma.service.deleteMany();
    await prisma.serviceCategory.deleteMany();
    await prisma.branch.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Cleared existing data');

    // Create Users
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const superAdmin = await prisma.user.create({
        data: {
            email: 'admin@lifescc.com',
            password: hashedPassword,
            firstName: 'Super',
            lastName: 'Admin',
            role: 'SUPER_ADMIN',
            phone: '+919876543210',
            isVerified: true,
            city: 'Hyderabad',
            state: 'Telangana'
        }
    });

    const admin1 = await prisma.user.create({
        data: {
            email: 'admin.jubilee@lifescc.com',
            password: hashedPassword,
            firstName: 'Rajesh',
            lastName: 'Kumar',
            role: 'ADMIN',
            phone: '+919876543211',
            isVerified: true,
            city: 'Hyderabad',
            state: 'Telangana'
        }
    });

    const admin2 = await prisma.user.create({
        data: {
            email: 'admin.banjara@lifescc.com',
            password: hashedPassword,
            firstName: 'Priya',
            lastName: 'Sharma',
            role: 'ADMIN',
            phone: '+919876543212',
            isVerified: true,
            city: 'Hyderabad',
            state: 'Telangana'
        }
    });

    const patients = await Promise.all([
        prisma.user.create({
            data: {
                email: 'ananya.reddy@gmail.com',
                password: hashedPassword,
                firstName: 'Ananya',
                lastName: 'Reddy',
                role: 'PATIENT',
                phone: '+919123456780',
                isVerified: true,
                dateOfBirth: new Date('1995-03-15'),
                gender: 'Female',
                city: 'Hyderabad',
                state: 'Telangana',
                address: 'Plot 123, Road No 36, Jubilee Hills'
            }
        }),
        prisma.user.create({
            data: {
                email: 'vikram.singh@gmail.com',
                password: hashedPassword,
                firstName: 'Vikram',
                lastName: 'Singh',
                role: 'PATIENT',
                phone: '+919123456781',
                isVerified: true,
                dateOfBirth: new Date('1988-07-22'),
                gender: 'Male',
                city: 'Hyderabad',
                state: 'Telangana',
                address: 'Flat 45, Green Valley Apartments, Banjara Hills'
            }
        }),
        prisma.user.create({
            data: {
                email: 'lakshmi.nair@gmail.com',
                password: hashedPassword,
                firstName: 'Lakshmi',
                lastName: 'Nair',
                role: 'PATIENT',
                phone: '+919123456782',
                isVerified: true,
                dateOfBirth: new Date('1992-11-08'),
                gender: 'Female',
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                address: '12-34-567, Beach Road, Visakhapatnam'
            }
        }),
        prisma.user.create({
            data: {
                email: 'rohan.mehta@gmail.com',
                password: hashedPassword,
                firstName: 'Rohan',
                lastName: 'Mehta',
                role: 'PATIENT',
                phone: '+919123456783',
                isVerified: true,
                dateOfBirth: new Date('1990-05-18'),
                gender: 'Male',
                city: 'Vijayawada',
                state: 'Andhra Pradesh',
                address: 'MG Road, Vijayawada'
            }
        }),
        prisma.user.create({
            data: {
                email: 'sneha.patel@gmail.com',
                password: hashedPassword,
                firstName: 'Sneha',
                lastName: 'Patel',
                role: 'PATIENT',
                phone: '+919123456784',
                isVerified: true,
                dateOfBirth: new Date('1993-09-25'),
                gender: 'Female',
                city: 'Hyderabad',
                state: 'Telangana',
                address: 'KPHB Colony, Kukatpally, Hyderabad'
            }
        })
    ]);

    console.log('✅ Created users (1 super admin, 2 admins, 5 patients)');

    // Create Branches
    const branches = await Promise.all([
        prisma.branch.create({
            data: {
                name: 'Jubilee Hills - Hyderabad',
                code: 'HYD-JH-001',
                address: 'Plot No. 123, Road No. 36, Jubilee Hills',
                city: 'Hyderabad',
                state: 'Telangana',
                pincode: '500033',
                phone: '+914040123456',
                email: 'jubileehills@lifescc.com',
                latitude: 17.4326,
                longitude: 78.4071,
                openingTime: '09:00',
                closingTime: '20:00',
                isActive: true
            }
        }),
        prisma.branch.create({
            data: {
                name: 'Banjara Hills - Hyderabad',
                code: 'HYD-BH-002',
                address: '8-2-293/82/A, Road No. 12, Banjara Hills',
                city: 'Hyderabad',
                state: 'Telangana',
                pincode: '500034',
                phone: '+914040123457',
                email: 'banjarahills@lifescc.com',
                latitude: 17.4239,
                longitude: 78.4738,
                openingTime: '09:00',
                closingTime: '20:00',
                isActive: true
            }
        }),
        prisma.branch.create({
            data: {
                name: 'Kukatpally - Hyderabad',
                code: 'HYD-KK-003',
                address: 'KPHB Main Road, Kukatpally',
                city: 'Hyderabad',
                state: 'Telangana',
                pincode: '500072',
                phone: '+914040123458',
                email: 'kukatpally@lifescc.com',
                latitude: 17.4849,
                longitude: 78.3905,
                openingTime: '09:00',
                closingTime: '20:00',
                isActive: true
            }
        }),
        prisma.branch.create({
            data: {
                name: 'Vizag - Visakhapatnam',
                code: 'VSP-001',
                address: '12-34-567, Dwaraka Nagar Main Road, Visakhapatnam',
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                pincode: '530016',
                phone: '+918912345678',
                email: 'vizag@lifescc.com',
                latitude: 17.7231,
                longitude: 83.3012,
                openingTime: '09:00',
                closingTime: '20:00',
                isActive: true
            }
        }),
        prisma.branch.create({
            data: {
                name: 'Vijayawada',
                code: 'VJA-001',
                address: 'MG Road, Labbipet, Vijayawada',
                city: 'Vijayawada',
                state: 'Andhra Pradesh',
                pincode: '520010',
                phone: '+918662345678',
                email: 'vijayawada@lifescc.com',
                latitude: 16.5062,
                longitude: 80.6480,
                openingTime: '09:00',
                closingTime: '20:00',
                isActive: true
            }
        })
    ]);

    console.log('✅ Created 5 branches');

    // Create Service Categories
    const categories = await Promise.all([
        prisma.serviceCategory.create({
            data: {
                name: 'Weight Loss',
                slug: 'weight-loss',
                description: 'Non-surgical slimming treatments and body contouring solutions',
                sortOrder: 1,
                isActive: true
            }
        }),
        prisma.serviceCategory.create({
            data: {
                name: 'Skin Care',
                slug: 'skin-care',
                description: 'Advanced facial treatments, laser therapy, and skin rejuvenation',
                sortOrder: 2,
                isActive: true
            }
        }),
        prisma.serviceCategory.create({
            data: {
                name: 'Hair Care',
                slug: 'hair-care',
                description: 'Hair restoration, PRP therapy, and scalp treatments',
                sortOrder: 3,
                isActive: true
            }
        })
    ]);

    console.log('✅ Created 3 service categories');

    // Create Services
    const services = await Promise.all([
        // Weight Loss Services
        prisma.service.create({
            data: {
                name: 'CoolSculpting - Fat Freezing',
                slug: 'coolsculpting-fat-freezing',
                description: 'Advanced cryolipolysis technology that freezes and eliminates stubborn fat cells without surgery. FDA-approved treatment for targeted fat reduction in problem areas like abdomen, thighs, and arms.',
                shortDesc: 'Non-surgical fat reduction using advanced cryolipolysis',
                duration: 60,
                price: 25000,
                discountPrice: 22000,
                image: 'https://www.lifescc.com/img/cools1.jpeg',
                benefits: [
                    'No surgery, needles, or downtime',
                    'FDA-approved and clinically proven',
                    'Targets stubborn fat pockets',
                    'Natural-looking results',
                    'Long-lasting fat reduction'
                ],
                isPopular: true,
                categoryId: categories[0].id
            }
        }),
        prisma.service.create({
            data: {
                name: 'Ultrasound Cavitation',
                slug: 'ultrasound-cavitation',
                description: 'Advanced ultrasound technology breaks down fat cells and reduces cellulite. Perfect for body contouring and inch loss in targeted areas.',
                shortDesc: 'Ultrasound-based fat reduction and cellulite treatment',
                duration: 45,
                price: 8000,
                discountPrice: 6500,
                image: 'https://www.lifescc.com/img/t3.png',
                benefits: [
                    'Non-invasive fat reduction',
                    'Reduces cellulite appearance',
                    'Immediate inch loss results',
                    'No recovery time needed',
                    'Safe and painless procedure'
                ],
                isPopular: true,
                categoryId: categories[0].id
            }
        }),
        prisma.service.create({
            data: {
                name: 'Inch Loss Therapy',
                slug: 'inch-loss-therapy',
                description: 'Comprehensive inch loss program combining multiple technologies for maximum results. Includes body wraps, RF treatment, and lymphatic drainage.',
                shortDesc: 'Multi-technology approach for complete body transformation',
                duration: 90,
                price: 12000,
                discountPrice: 10000,
                image: 'https://www.lifescc.com/img/t6.png',
                benefits: [
                    'Visible inch loss in first session',
                    'Improves skin texture and tone',
                    'Boosts metabolism',
                    'Detoxifies the body',
                    'Customized treatment plans'
                ],
                isPopular: false,
                categoryId: categories[0].id
            }
        }),
        prisma.service.create({
            data: {
                name: 'RF Body Contouring',
                slug: 'rf-body-contouring',
                description: 'Radio Frequency technology tightens skin and reduces fat simultaneously. Ideal for body sculpting and skin tightening post-weight loss.',
                shortDesc: 'Radio frequency treatment for skin tightening and fat reduction',
                duration: 60,
                price: 15000,
                discountPrice: 13500,
                image: 'https://www.lifescc.com/img/t1.png',
                benefits: [
                    'Tightens loose skin',
                    'Reduces localized fat',
                    'Stimulates collagen production',
                    'Improves body contours',
                    'Zero downtime'
                ],
                isPopular: false,
                categoryId: categories[0].id
            }
        }),
        prisma.service.create({
            data: {
                name: 'Diet & Nutrition Consultation',
                slug: 'diet-nutrition-consultation',
                description: 'Personalized diet plans by certified nutritionists. Comprehensive assessment including body composition analysis and customized meal planning.',
                shortDesc: 'Expert nutritional guidance for sustainable weight management',
                duration: 30,
                price: 2000,
                image: 'https://www.lifescc.com/img/loss.jpg',
                benefits: [
                    'Personalized meal plans',
                    'Body composition analysis',
                    'Ongoing support and monitoring',
                    'Lifestyle modification guidance',
                    'Sustainable weight management'
                ],
                isPopular: false,
                categoryId: categories[0].id
            }
        }),

        // Skin Care Services
        prisma.service.create({
            data: {
                name: 'HydraFacial MD',
                slug: 'hydrafacial-md',
                description: 'The ultimate medical-grade facial treatment combining cleansing, exfoliation, extraction, hydration, and antioxidant protection. Suitable for all skin types.',
                shortDesc: 'Medical-grade 4-in-1 facial treatment',
                duration: 60,
                price: 8000,
                discountPrice: 7000,
                image: 'https://www.lifescc.com/img/scul1.jpg',
                benefits: [
                    'Deep cleansing and exfoliation',
                    'Painless extractions',
                    'Intense hydration boost',
                    'Immediate visible results',
                    'No downtime required'
                ],
                isPopular: true,
                categoryId: categories[1].id
            }
        }),
        prisma.service.create({
            data: {
                name: 'Chemical Peel Treatment',
                slug: 'chemical-peel-treatment',
                description: 'Professional-grade chemical peels to treat acne, pigmentation, fine lines, and dull skin. Customized peel selection based on your skin concerns.',
                shortDesc: 'Advanced chemical peels for skin rejuvenation',
                duration: 45,
                price: 5000,
                discountPrice: 4500,
                image: 'https://www.lifescc.com/img/scul2.jpg',
                benefits: [
                    'Reduces acne and scars',
                    'Lightens pigmentation',
                    'Minimizes fine lines',
                    'Evens skin tone',
                    'Promotes collagen production'
                ],
                isPopular: true,
                categoryId: categories[1].id
            }
        }),
        prisma.service.create({
            data: {
                name: 'Laser Hair Removal',
                slug: 'laser-hair-removal',
                description: 'Advanced laser technology for permanent hair reduction. Safe, effective treatment for all skin types with minimal discomfort.',
                shortDesc: 'Permanent hair reduction with laser technology',
                duration: 45,
                price: 6000,
                discountPrice: 5500,
                image: 'https://www.lifescc.com/img/scul2.jpg',
                benefits: [
                    'Permanent hair reduction',
                    'Suitable for all skin types',
                    'Minimal discomfort',
                    'Quick treatment sessions',
                    'Smooth, hair-free skin'
                ],
                isPopular: true,
                categoryId: categories[1].id
            }
        }),
        prisma.service.create({
            data: {
                name: 'Anti-Aging Treatment',
                slug: 'anti-aging-treatment',
                description: 'Comprehensive anti-aging program combining Botox, fillers, and skin boosters for complete facial rejuvenation. Customized to your specific concerns.',
                shortDesc: 'Complete facial rejuvenation solution',
                duration: 60,
                price: 35000,
                discountPrice: 32000,
                image: 'https://www.lifescc.com/img/scul3.jpg',
                benefits: [
                    'Reduces wrinkles and fine lines',
                    'Restores facial volume',
                    'Improves skin quality',
                    'Natural-looking results',
                    'Minimal downtime'
                ],
                isPopular: true,
                categoryId: categories[1].id
            }
        }),
        prisma.service.create({
            data: {
                name: 'Stretch Marks Treatment',
                slug: 'stretch-marks-treatment',
                description: 'Advanced treatment combining laser therapy and microneedling to reduce the appearance of stretch marks. Effective for both old and new stretch marks.',
                shortDesc: 'Reduce stretch marks with advanced technology',
                duration: 60,
                price: 10000,
                discountPrice: 9000,
                image: 'https://www.lifescc.com/img/scul4.jpg',
                benefits: [
                    'Reduces stretch mark appearance',
                    'Improves skin texture',
                    'Boosts collagen production',
                    'Works on old and new marks',
                    'Safe and effective'
                ],
                isPopular: false,
                categoryId: categories[1].id
            }
        }),

        // Hair Care Services
        prisma.service.create({
            data: {
                name: 'Hair Regrowth Therapy',
                slug: 'hair-regrowth-therapy',
                description: 'Advanced hair regrowth treatment combining PRP, mesotherapy, and laser therapy. Comprehensive solution for hair loss and thinning.',
                shortDesc: 'Complete hair regrowth solution',
                duration: 60,
                price: 10000,
                discountPrice: 9000,
                image: 'https://www.lifescc.com/img/home.jpg',
                benefits: [
                    'Stimulates natural hair growth',
                    'Reduces hair fall',
                    'Thickens existing hair',
                    'Safe and natural treatment',
                    'Minimal side effects'
                ],
                isPopular: true,
                categoryId: categories[2].id
            }
        }),
        prisma.service.create({
            data: {
                name: 'Hair Transplantation',
                slug: 'hair-transplantation',
                description: 'Advanced FUE hair transplant by expert surgeons. Permanent solution for baldness with natural-looking results.',
                shortDesc: 'Permanent hair restoration surgery',
                duration: 240,
                price: 80000,
                discountPrice: 75000,
                image: 'https://www.lifescc.com/img/home3.jpg',
                benefits: [
                    'Permanent hair restoration',
                    'Natural-looking results',
                    'Minimal scarring',
                    'Expert surgeons',
                    'Long-lasting solution'
                ],
                isPopular: true,
                categoryId: categories[2].id
            }
        }),
        prisma.service.create({
            data: {
                name: 'Anti Dandruff Treatment',
                slug: 'anti-dandruff-treatment',
                description: 'Specialized scalp treatment to eliminate dandruff and soothe irritated scalp. Combines medical therapy with deep cleansing.',
                shortDesc: 'Complete dandruff elimination treatment',
                duration: 45,
                price: 4000,
                discountPrice: 3500,
                image: 'https://www.lifescc.com/img/home2.jpg',
                benefits: [
                    'Eliminates dandruff completely',
                    'Soothes scalp irritation',
                    'Reduces itching and flaking',
                    'Improves scalp health',
                    'Long-lasting results'
                ],
                isPopular: false,
                categoryId: categories[2].id
            }
        }),
        prisma.service.create({
            data: {
                name: 'Scalp Treatment & Mesotherapy',
                slug: 'scalp-treatment-mesotherapy',
                description: 'Advanced mesotherapy injects nutrients directly into the scalp to nourish hair follicles and promote healthy hair growth.',
                shortDesc: 'Nutrient injection therapy for healthy hair growth',
                duration: 45,
                price: 7500,
                discountPrice: 6800,
                image: 'https://www.lifescc.com/img/home1.jpg',
                benefits: [
                    'Nourishes hair follicles',
                    'Strengthens hair roots',
                    'Reduces hair fall',
                    'Improves scalp health',
                    'Visible results in weeks'
                ],
                isPopular: true,
                categoryId: categories[2].id
            }
        }),
        prisma.service.create({
            data: {
                name: 'Non-Surgical Hair Replacement',
                slug: 'non-surgical-hair-replacement',
                description: 'Advanced hair replacement system using premium quality hair. Natural-looking solution for complete baldness without surgery.',
                shortDesc: 'Natural-looking hair replacement without surgery',
                duration: 120,
                price: 40000,
                discountPrice: 35000,
                image: 'https://www.lifescc.com/img/home4.jpg',
                benefits: [
                    'Instant full head of hair',
                    'Natural appearance',
                    'Non-surgical solution',
                    'Customized to match your hair',
                    'Maintenance and styling support'
                ],
                isPopular: false,
                categoryId: categories[2].id
            }
        })
    ]);

    console.log('✅ Created 15 services');

    // Create Branch-Service Mappings (all services available at all branches)
    const branchServiceMappings = [];
    for (const branch of branches) {
        for (const service of services) {
            branchServiceMappings.push({
                branchId: branch.id,
                serviceId: service.id,
                isActive: true
            });
        }
    }
    await prisma.branchService.createMany({ data: branchServiceMappings });

    console.log('✅ Created branch-service mappings');

    // Create sample appointments
    const appointmentData = [
        // Past completed appointments
        {
            appointmentDate: new Date('2026-01-15T10:00:00'),
            timeSlot: '10:00',
            status: 'COMPLETED' as const,
            patientName: patients[0].firstName + ' ' + patients[0].lastName,
            patientPhone: patients[0].phone!,
            patientEmail: patients[0].email,
            userId: patients[0].id,
            serviceId: services[0].id,
            branchId: branches[0].id,
            notes: 'First consultation for CoolSculpting'
        },
        {
            appointmentDate: new Date('2026-01-18T14:30:00'),
            timeSlot: '14:30',
            status: 'COMPLETED' as const,
            patientName: patients[1].firstName + ' ' + patients[1].lastName,
            patientPhone: patients[1].phone!,
            patientEmail: patients[1].email,
            userId: patients[1].id,
            serviceId: services[5].id,
            branchId: branches[1].id
        },
        {
            appointmentDate: new Date('2026-01-20T11:00:00'),
            timeSlot: '11:00',
            status: 'COMPLETED' as const,
            patientName: patients[2].firstName + ' ' + patients[2].lastName,
            patientPhone: patients[2].phone!,
            patientEmail: patients[2].email,
            userId: patients[2].id,
            serviceId: services[10].id,
            branchId: branches[3].id,
            adminNotes: 'Patient responded very well to PRP treatment'
        },
        {
            appointmentDate: new Date('2026-01-25T15:00:00'),
            timeSlot: '15:00',
            status: 'COMPLETED' as const,
            patientName: patients[3].firstName + ' ' + patients[3].lastName,
            patientPhone: patients[3].phone!,
            patientEmail: patients[3].email,
            userId: patients[3].id,
            serviceId: services[6].id,
            branchId: branches[4].id
        },
        {
            appointmentDate: new Date('2026-02-01T10:30:00'),
            timeSlot: '10:30',
            status: 'COMPLETED' as const,
            patientName: patients[4].firstName + ' ' + patients[4].lastName,
            patientPhone: patients[4].phone!,
            patientEmail: patients[4].email,
            userId: patients[4].id,
            serviceId: services[1].id,
            branchId: branches[2].id
        },

        // Recent past - confirmed but not completed
        {
            appointmentDate: new Date('2026-02-05T09:30:00'),
            timeSlot: '09:30',
            status: 'NO_SHOW' as const,
            patientName: 'Rahul Verma',
            patientPhone: '+919876543299',
            patientEmail: 'rahul.v@gmail.com',
            serviceId: services[13].id,
            branchId: branches[0].id,
            adminNotes: 'Patient did not show up, tried calling multiple times'
        },
        {
            appointmentDate: new Date('2026-02-08T16:00:00'),
            timeSlot: '16:00',
            status: 'CANCELLED' as const,
            patientName: patients[0].firstName + ' ' + patients[0].lastName,
            patientPhone: patients[0].phone!,
            patientEmail: patients[0].email,
            userId: patients[0].id,
            serviceId: services[8].id,
            branchId: branches[1].id,
            cancelReason: 'Patient had to travel urgently for work'
        },

        // Upcoming confirmed appointments
        {
            appointmentDate: new Date('2026-02-13T11:30:00'),
            timeSlot: '11:30',
            status: 'CONFIRMED' as const,
            patientName: patients[1].firstName + ' ' + patients[1].lastName,
            patientPhone: patients[1].phone!,
            patientEmail: patients[1].email,
            userId: patients[1].id,
            serviceId: services[5].id,
            branchId: branches[1].id,
            notes: 'Follow-up HydraFacial session'
        },
        {
            appointmentDate: new Date('2026-02-14T10:00:00'),
            timeSlot: '10:00',
            status: 'CONFIRMED' as const,
            patientName: patients[2].firstName + ' ' + patients[2].lastName,
            patientPhone: patients[2].phone!,
            patientEmail: patients[2].email,
            userId: patients[2].id,
            serviceId: services[10].id,
            branchId: branches[3].id,
            notes: 'Second PRP session'
        },
        {
            appointmentDate: new Date('2026-02-15T14:00:00'),
            timeSlot: '14:00',
            status: 'CONFIRMED' as const,
            patientName: 'Meera Krishnan',
            patientPhone: '+919123456799',
            patientEmail: 'meera.k@gmail.com',
            serviceId: services[0].id,
            branchId: branches[0].id,
            notes: 'Interested in abdomen fat reduction'
        },
        {
            appointmentDate: new Date('2026-02-16T15:30:00'),
            timeSlot: '15:30',
            status: 'CONFIRMED' as const,
            patientName: patients[4].firstName + ' ' + patients[4].lastName,
            patientPhone: patients[4].phone!,
            patientEmail: patients[4].email,
            userId: patients[4].id,
            serviceId: services[1].id,
            branchId: branches[2].id,
            notes: 'Second cavitation session'
        },

        // Pending appointments (awaiting confirmation)
        {
            appointmentDate: new Date('2026-02-17T10:00:00'),
            timeSlot: '10:00',
            status: 'PENDING' as const,
            patientName: 'Arjun Patel',
            patientPhone: '+919876543300',
            patientEmail: 'arjun.patel@gmail.com',
            serviceId: services[11].id,
            branchId: branches[0].id,
            notes: 'First time consultation for hair transplant'
        },
        {
            appointmentDate: new Date('2026-02-18T11:00:00'),
            timeSlot: '11:00',
            status: 'PENDING' as const,
            patientName: 'Divya Menon',
            patientPhone: '+919876543301',
            patientEmail: 'divya.m@gmail.com',
            serviceId: services[6].id,
            branchId: branches[1].id
        },
        {
            appointmentDate: new Date('2026-02-18T16:00:00'),
            timeSlot: '16:00',
            status: 'PENDING' as const,
            patientName: patients[3].firstName + ' ' + patients[3].lastName,
            patientPhone: patients[3].phone!,
            patientEmail: patients[3].email,
            userId: patients[3].id,
            serviceId: services[9].id,
            branchId: branches[4].id,
            notes: 'Interested in full face anti-aging treatment'
        },
        {
            appointmentDate: new Date('2026-02-19T09:00:00'),
            timeSlot: '09:00',
            status: 'PENDING' as const,
            patientName: 'Karthik Reddy',
            patientPhone: '+919876543302',
            serviceId: services[13].id,
            branchId: branches[2].id
        },

        // More upcoming appointments
        {
            appointmentDate: new Date('2026-02-20T13:30:00'),
            timeSlot: '13:30',
            status: 'CONFIRMED' as const,
            patientName: 'Pooja Iyer',
            patientPhone: '+919123456800',
            patientEmail: 'pooja.iyer@gmail.com',
            serviceId: services[7].id,
            branchId: branches[0].id
        },
        {
            appointmentDate: new Date('2026-02-21T10:30:00'),
            timeSlot: '10:30',
            status: 'PENDING' as const,
            patientName: 'Suresh Babu',
            patientPhone: '+919123456801',
            serviceId: services[2].id,
            branchId: branches[3].id,
            notes: 'Interested in complete body contouring package'
        },
        {
            appointmentDate: new Date('2026-02-22T11:00:00'),
            timeSlot: '11:00',
            status: 'CONFIRMED' as const,
            patientName: patients[0].firstName + ' ' + patients[0].lastName,
            patientPhone: patients[0].phone!,
            patientEmail: patients[0].email,
            userId: patients[0].id,
            serviceId: services[0].id,
            branchId: branches[0].id,
            notes: 'Second CoolSculpting session - thighs'
        },
        {
            appointmentDate: new Date('2026-02-23T14:00:00'),
            timeSlot: '14:00',
            status: 'PENDING' as const,
            patientName: 'Gayatri Devi',
            patientPhone: '+919123456802',
            patientEmail: 'gayatri.d@gmail.com',
            serviceId: services[5].id,
            branchId: branches[1].id
        },
        {
            appointmentDate: new Date('2026-02-24T15:00:00'),
            timeSlot: '15:00',
            status: 'CONFIRMED' as const,
            patientName: 'Naveen Kumar',
            patientPhone: '+919123456803',
            serviceId: services[12].id,
            branchId: branches[4].id,
            notes: 'Third session of laser hair regrowth'
        },
        {
            appointmentDate: new Date('2026-02-25T10:00:00'),
            timeSlot: '10:00',
            status: 'RESCHEDULED' as const,
            patientName: patients[4].firstName + ' ' + patients[4].lastName,
            patientPhone: patients[4].phone!,
            patientEmail: patients[4].email,
            userId: patients[4].id,
            serviceId: services[4].id,
            branchId: branches[2].id,
            notes: 'Rescheduled from Feb 12 - patient request',
            adminNotes: 'Originally booked for Feb 12 at 16:00'
        }
    ];

    await prisma.appointment.createMany({ data: appointmentData });

    console.log('✅ Created 20 appointments with various statuses');

    // Create Leads
    const leadData = [
        {
            name: 'Sanjay Gupta',
            email: 'sanjay.gupta@gmail.com',
            phone: '+919876543400',
            message: 'I am interested in hair transplant. What is the cost and how many sessions are required?',
            serviceInterest: 'Hair Transplant',
            source: 'WEBSITE_FORM' as const,
            status: 'NEW' as const
        },
        {
            name: 'Nisha Agarwal',
            phone: '+919876543401',
            email: 'nisha.ag@gmail.com',
            message: 'Want to book a consultation for weight loss treatment',
            serviceInterest: 'Weight Loss Programs',
            source: 'CALLBACK_REQUEST' as const,
            status: 'NEW' as const
        },
        {
            name: 'Ramesh Babu',
            phone: '+919876543402',
            serviceInterest: 'CoolSculpting',
            source: 'PHONE_INQUIRY' as const,
            status: 'CONTACTED' as const,
            notes: 'Called and explained the procedure. Will get back in 2 days.',
            followUpDate: new Date('2026-02-14')
        },
        {
            name: 'Kavita Sharma',
            email: 'kavita.sharma@gmail.com',
            phone: '+919876543403',
            message: 'I saw your Instagram post about HydraFacial. Would like to try it.',
            serviceInterest: 'HydraFacial',
            source: 'SOCIAL_MEDIA' as const,
            status: 'INTERESTED' as const,
            notes: 'Very interested, planning to book next week',
            followUpDate: new Date('2026-02-13')
        },
        {
            name: 'Prakash Reddy',
            phone: '+919876543404',
            email: 'prakash.r@gmail.com',
            serviceInterest: 'Acne Treatment',
            source: 'REFERRAL' as const,
            status: 'CONVERTED' as const,
            notes: 'Referred by Ananya Reddy. Booked appointment for Feb 18.',
            userId: patients[0].id
        },
        {
            name: 'Deepa Menon',
            phone: '+919876543405',
            message: 'Interested in anti-aging treatments for face',
            serviceInterest: 'Anti-Aging',
            source: 'WEBSITE_FORM' as const,
            status: 'CONTACTED' as const,
            notes: 'Sent detailed brochure via email. Waiting for response.',
            followUpDate: new Date('2026-02-15')
        },
        {
            name: 'Vinay Kumar',
            phone: '+919876543406',
            email: 'vinay.k@gmail.com',
            serviceInterest: 'PRP Hair Treatment',
            source: 'WALK_IN' as const,
            status: 'INTERESTED' as const,
            notes: 'Visited Jubilee Hills branch. Explained the procedure. Thinking about it.',
            followUpDate: new Date('2026-02-16')
        },
        {
            name: 'Anjali Singh',
            phone: '+919876543407',
            email: 'anjali.singh@gmail.com',
            message: 'What is the cost for laser hair removal?',
            serviceInterest: 'Laser Hair Removal',
            source: 'WEBSITE_FORM' as const,
            status: 'NEW' as const
        },
        {
            name: 'Manoj Patel',
            phone: '+919876543408',
            serviceInterest: 'Body Contouring',
            source: 'PHONE_INQUIRY' as const,
            status: 'LOST' as const,
            notes: 'Found the pricing too high. Not interested anymore.'
        },
        {
            name: 'Ritu Das',
            email: 'ritu.das@gmail.com',
            phone: '+919876543409',
            message: 'I want to reduce belly fat without surgery. Please call me back.',
            serviceInterest: 'CoolSculpting',
            source: 'CALLBACK_REQUEST' as const,
            status: 'NEW' as const
        },
        {
            name: 'Harish Rao',
            phone: '+919876543410',
            email: 'harish.rao@gmail.com',
            serviceInterest: 'Chemical Peel',
            source: 'SOCIAL_MEDIA' as const,
            status: 'CONTACTED' as const,
            notes: 'Explained different types of peels. Suggested a consultation.',
            followUpDate: new Date('2026-02-17')
        },
        {
            name: 'Swati Joshi',
            phone: '+919876543411',
            message: 'Interested in bridal skin treatment packages',
            serviceInterest: 'Skin Care',
            source: 'WEBSITE_FORM' as const,
            status: 'INTERESTED' as const,
            notes: 'Wedding in April. Wants to start treatment from March.',
            followUpDate: new Date('2026-02-20')
        },
        {
            name: 'Aditya Mehta',
            phone: '+919876543412',
            email: 'aditya.mehta@gmail.com',
            serviceInterest: 'Hair Transplant Consultation',
            source: 'REFERRAL' as const,
            status: 'CONVERTED' as const,
            notes: 'Booked consultation appointment for Feb 17.',
            userId: patients[3].id
        },
        {
            name: 'Priyanka Nair',
            phone: '+919876543413',
            email: 'priyanka.nair@gmail.com',
            message: 'Do you have any offers on HydraFacial?',
            serviceInterest: 'HydraFacial',
            source: 'WEBSITE_FORM' as const,
            status: 'NEW' as const
        },
        {
            name: 'Kiran Sharma',
            phone: '+919876543414',
            serviceInterest: 'Weight Loss',
            source: 'PHONE_INQUIRY' as const,
            status: 'CONTACTED' as const,
            notes: 'Interested in inch loss therapy. Sent pricing details.',
            followUpDate: new Date('2026-02-14')
        },
        {
            name: 'Varun Kapoor',
            phone: '+919876543415',
            email: 'varun.k@gmail.com',
            serviceInterest: 'Laser Skin Treatment',
            source: 'WALK_IN' as const,
            status: 'LOST' as const,
            notes: 'Visited but went to a competitor clinic.'
        },
        {
            name: 'Shreya Pillai',
            phone: '+919876543416',
            email: 'shreya.pillai@gmail.com',
            message: 'Want to know about mesotherapy for hair',
            serviceInterest: 'Scalp Mesotherapy',
            source: 'WEBSITE_FORM' as const,
            status: 'INTERESTED' as const,
            notes: 'Very keen. Planning to visit next week for consultation.',
            followUpDate: new Date('2026-02-18')
        },
        {
            name: 'Mohan Lal',
            phone: '+919876543417',
            serviceInterest: 'Diet Consultation',
            source: 'CALLBACK_REQUEST' as const,
            status: 'NEW' as const
        }
    ];

    await prisma.lead.createMany({ data: leadData });

    console.log('✅ Created 18 leads with various statuses');

    // Create Contact Messages
    const contactMessages = [
        {
            name: 'Rajiv Kumar',
            email: 'rajiv.kumar@gmail.com',
            phone: '+919876543500',
            subject: 'Franchise Inquiry',
            message: 'I am interested in opening a LifeSCC franchise in Warangal. Please share the details and requirements.',
            isRead: false
        },
        {
            name: 'Sunita Desai',
            email: 'sunita.d@gmail.com',
            phone: '+919876543501',
            subject: 'Career Opportunities',
            message: 'I am a certified dermatologist with 5 years of experience. Are there any job openings at your Hyderabad branches?',
            isRead: true
        },
        {
            name: 'Amit Verma',
            email: 'amit.verma@gmail.com',
            subject: 'Partnership Inquiry',
            message: 'Our company provides medical equipment. Would like to discuss potential partnership opportunities.',
            isRead: false
        },
        {
            name: 'Geeta Iyer',
            email: 'geeta.iyer@gmail.com',
            phone: '+919876543502',
            subject: 'Feedback - Excellent Service',
            message: 'I recently visited your Jubilee Hills branch for HydraFacial. The staff was very professional and the results were amazing. Thank you!',
            isRead: true
        },
        {
            name: 'Ashok Reddy',
            email: 'ashok.reddy@gmail.com',
            phone: '+919876543503',
            subject: 'Appointment Reschedule Request',
            message: 'I have an appointment on Feb 15 but need to reschedule due to personal reasons. Please call me back.',
            isRead: false
        }
    ];

    await prisma.contactMessage.createMany({ data: contactMessages });

    console.log('✅ Created 5 contact messages');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${await prisma.user.count()} (1 super admin, 2 admins, 5 patients)`);
    console.log(`   - Branches: ${await prisma.branch.count()}`);
    console.log(`   - Service Categories: ${await prisma.serviceCategory.count()}`);
    console.log(`   - Services: ${await prisma.service.count()}`);
    console.log(`   - Appointments: ${await prisma.appointment.count()}`);
    console.log(`   - Leads: ${await prisma.lead.count()}`);
    console.log(`   - Contact Messages: ${await prisma.contactMessage.count()}`);
    console.log('\n✅ Login credentials:');
    console.log('   Super Admin: admin@lifescc.com / Admin@123');
    console.log('   Any Patient: ananya.reddy@gmail.com / Admin@123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
