const QUESTION_BANK = [
  {
    id: 1,
    subjectName: 'Anatomy',
    text: 'Which cranial nerve supplies the lateral rectus muscle?',
    options: ['Oculomotor nerve', 'Trochlear nerve', 'Abducens nerve', 'Facial nerve'],
    answer: 2,
    explanation:
      'The lateral rectus abducts the eye and is supplied by the abducens nerve (cranial nerve VI).',
  },
  {
    id: 2,
    subjectName: 'Anatomy',
    text: 'Which muscle is shown in this anterior trunk illustration?',
    image: require('../assets/images/subjects/Anatomy.png'),
    imageAspectRatio: 1.58,
    options: ['Rectus abdominis', 'Latissimus dorsi', 'Trapezius', 'Gluteus maximus'],
    answer: 0,
    explanation:
      'The rectus abdominis is the paired vertical muscle on the anterior abdominal wall.',
  },
  {
    id: 3,
    subjectName: 'Radiology',
    text: 'Which imaging view is shown?',
    image: require('../assets/images/subjects/Radiology.png'),
    imageAspectRatio: 0.78,
    options: ['Lateral skull radiograph', 'Chest radiograph', 'Abdominal CT', 'Brain MRI'],
    answer: 0,
    explanation:
      'This image represents a lateral skull radiograph, a side-on projection of the skull.',
  },
  {
    id: 4,
    subjectName: 'Pathology',
    text: 'Which tissue type is represented in this sample image?',
    image: require('../assets/images/subjects/Pathology.png'),
    imageAspectRatio: 1.58,
    options: ['Histology specimen', 'Plain radiograph', 'Gross anatomy model', 'Ultrasound image'],
    answer: 0,
    explanation:
      'A histology specimen is examined as a tissue section, commonly using a microscope.',
  },
  {
    id: 5,
    subjectName: 'Physiology',
    text: 'What is the primary function of pulmonary surfactant?',
    options: [
      'Increase alveolar surface tension',
      'Reduce alveolar surface tension',
      'Increase airway resistance',
      'Prevent oxygen diffusion',
    ],
    answer: 1,
    explanation:
      'Pulmonary surfactant reduces surface tension at the air–liquid interface, helping stabilize alveoli and reduce the work of breathing.',
  },
  {
    id: 6,
    subjectName: 'Anatomy',
    text: 'The image shows a section of the anterior abdominal wall. Which structure is indicated?',
    image: require('../assets/images/subjects/Anatomy.png'),
    imageAspectRatio: 0.78,
    options: ['Rectus abdominis', 'Serratus anterior', 'Infraspinatus', 'Deltoid'],
    answer: 0,
    explanation:
      'The rectus abdominis is the paired vertical muscle running along the anterior abdominal wall.',
    explanationImage: require('../assets/images/subjects/Anatomy.png'),
  },
  {
    id: 7,
    subjectName: 'Biochemistry',
    text: 'Which vitamin deficiency is classically associated with scurvy?',
    options: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'],
    answer: 2,
    explanation:
      'Vitamin C is required for normal collagen hydroxylation. Deficiency impairs connective tissue formation and causes scurvy.',
    explanationTable: {
      headers: ['Finding', 'Association'],
      rows: [
        ['Bleeding gums', 'Fragile capillaries'],
        ['Poor wound healing', 'Impaired collagen'],
        ['Perifollicular bleeding', 'Vitamin C deficiency'],
      ],
    },
  },
];

export default QUESTION_BANK;
