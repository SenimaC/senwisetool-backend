import {
  PrismaClient,
  Requirement,
  RequirementGroup,
  RequirementSection,
} from '@prisma/client';

type RequirementType = {
  description?: string;
  number: string;
  groups: string[];
};

export const requirements: RequirementType[] = [
  {
    number: '1.1.1',
    description:
      'La direction du groupe montre son engagement en faveur d’une agriculture durable en consacrant suffisamment de ressources et de personnel à la mise en œuvre de la Norme pour l’Agriculture Durable de Rainforest Alliance. Tous les trois ans, au minimum, la direction évalue sa capacité à mettre en œuvre la Norme de Rainforest Alliance et démontre par la suite son amélioration continue au travers d’évaluations. La direction met en place des comités en charge des questions suivantes : • Mécanisme de Réclamation (veuillez consulter le 1.5) • Égalité des Genres (veuillez consulter le 1.6) • Évaluation et Résolution (veuillez consulter le 5.1) • Santé et sécurité au travail (veuillez consulter le 5.6) Remarque : Ces questions peuvent être prises en charge par un seul comité. Le(s) comité(s) : - incluent au moins un représentant de la direction disposant d’un pouvoir de décision ; - sont impartiaux, disponibles, sensibles à la question des genres. Ils ont la confiance des membres/travailleurs du groupe, y compris des personnes vulnérables.',
    groups: [
      'Grandes exploitations agricoles',
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
    ],
  },
  {
    number: '1.2.1',
    description:
      "La direction et les agriculteurs se mettent en conformité avec les lois applicables pertinentes par rapport au champ d’application de la Norme de Rainforest Alliance. Y compris, mais sans s’y limiter : Droits d’utilisation des terres ; Environnement ; Travail ; Droits humains ; LCPE ; Taxes et questions relatives à la lutte anticorruption. Si une loi applicable est plus stricte qu’une exigence de la Norme, alors elle prévaut, sauf en cas d’obsolescence. À l’inverse, si une législation applicable est moins stricte qu'une exigence de la Norme, alors l’exigence de la Norme prévaut.",
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '1.2.2',
    description:
      'Il existe une liste exhaustive des prestataires de services, fournisseurs, intermédiaires et sous-traitants. Des mécanismes, dont des contrats, sont mis en place pour veiller à ce que ces entités soient en conformité avec les exigences applicables de la Norme en ce qui concerne leurs activités qui entrent dans le champ d’application de la certification. Pour les exploitations agricoles : Valable pour les travaux sur le terrain, les activités de transformation et le placement de main-d’œuvre. Le terme « fournisseurs » fait uniquement référence aux autres exploitations auprès desquelles elles achètent des produits certifiés. Pour les petites exploitations agricoles faisant partie d’un groupe, cette exigence ne s’applique pas.',
    groups: [
      'Grandes exploitations agricoles',
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
    ],
  },
  {
    number: '1.2.3',
    description:
      'Un registre des membres du groupe est tenu à jour. Les informations obligatoires pour chaque membre sont recueillies à l’aide du formulaire de Registre des Membres du Groupe transmis par Rainforest Alliance.',
    groups: ['Direction du groupe'],
  },
  {
    number: '1.2.4',
    description:
      'Une liste à jour des travailleurs temporaires et permanents est conservée, contenant pour chaque travailleur : Nom complet ; Genre ; Année de naissance ; Date(s) de début et de fin d’embauche ; Salaires, y compris les avantages. Pour les travailleurs auxquels le logement est fourni, le registre contient en plus : Adresse du logement ; Nombre de membres de famille ; Année de naissance des membres de la famille. Pour les enfants effectuant des travaux légers (entre 12 et 12 ans) et les jeunes travailleurs (entre 15 ans et 15 ans) le registre contient en plus : Adresse du logement ; Nom et adresse du parent(s) ou du tuteur(s) légal ; Inscription à l’école (le cas échéant) ; Type de travail ou tâches ; Le nombre d’heures de travail par jour et par semaine. Pour les petites exploitations agricoles faisant partie d’un groupe, seule l’exigence 1.2.5 s’applique.',
    groups: [
      'Grandes exploitations agricoles',
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '1.2.5',
    description:
      'Une liste à jour des travailleurs permanents est conservée, contenant pour chaque travailleur : Nom complet ; Genre ; Année de naissance ; Salaires, y compris les avantages. En ce qui concerne les travailleurs temporaires, seul le nombre de travailleurs est demandé. Les membres du groupe illettrés peuvent donner oralement les informations ci-dessus.',
    groups: ['Petites exploitations agricoles'],
  },
  {
    number: '1.2.6',
    description:
      "Dès lors que la Norme de Rainforest Alliance requiert d'informer les travailleurs ou les membres du groupe, la direction s’assure que les informations sont données dans les langues prédominantes des travailleurs ou des membres du groupe.",
    groups: [
      'Grandes exploitations agricoles',
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '1.2.7',
    description:
      "Un accord a été conclu entre la direction du groupe et chaque membre du groupe, signé par les deux parties. Une empreinte digitale ou marque identifiable peut être utilisée à la place d’une signature. L’accord comprend les éléments suivants : L’obligation du membre du groupe de se conformer à la Norme de Rainforest Alliance ; L’obligation du membre du groupe d’accepter à la fois les inspections internes et les audits externes et les sanctions ; La garantie du membre du groupe que tout produit vendu comme certifié provient uniquement de son exploitation agricole ; Le droit du membre du groupe de faire appel des décisions faites par la direction du groupe en utilisant la procédure de réclamation ; L'accord du membre du groupe pour partager les données agricoles de ce membre avec la direction du groupe et Rainforest Alliance pour l'utilisation, la publication et le partage comme décrit dans les Conditions Générales de Rainforest Alliance et sa Politique de Confidentialité. Chaque membre du groupe com.",
    groups: ['Direction du groupe', 'Systeme de gestion interne (SGI)'],
  },
  {
    number: '1.2.8',
    description:
      'Les dossiers concernant la certification et la conformité sont conservés pour une durée minimale de 5 ans.',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '1.2.9',
    description:
      'Une carte actualisée de la zone de l’exploitation est disponible et doit inclure : Exploitations agricoles/unités agricoles/zones de production ; Installations de transformation ; Zones d’habitations humaines ; Écoles ; Centres médicaux/sites de premiers soins ; Écosystèmes naturels, dont les étendues d’eau et les forêts, et les autres végétations naturelles existantes ; Zones ripariennes tampons ; Systèmes agroforestiers ; Les aires protégées (AP). La carte inclut également les zones à risques identifiées dans l’Évaluation des Risques (voir 1.3.1). La date de la dernière mise à jour est indiquée sur la carte. Les grandes exploitations agricoles faisant partie d’un groupe doivent fournir une carte de leur exploitation.',
    groups: [
      'Grandes exploitations agricoles',
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '1.2.10',
    description:
      "Pour 100 % des exploitations agricoles, les données de géolocalisation de toutes les unités agricoles produisant la culture certifiée sont disponibles. Pour au moins 35 % des exploitations agricoles, les données de géolocalisation sont disponibles sous forme d'un polygone GPS. Lors du deuxième audit de certification, toutes les unités agricoles disposent de polygones. Veuillez consulter A-04-SCRL-B-CH - Annexe Gestion.",
    groups: ['Direction du groupe', 'Systeme de gestion interne (SGI)'],
  },
  {
    number: '1.2.11',
    description:
      'Un polygone est disponible pour chaque unité agricole. Veuillez consulter A-04-SCRL-B-CH - Annexe Gestion et le SA-G-SD-5 Document d’orientation D : Exigences en matière de données de géolocalisation et cartes de risques.',
    groups: [
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
    ],
  },
  {
    number: '1.3.1',
    description:
      "La direction effectue une évaluation des risques relatifs aux exigences de la norme, en utilisant l'Outil d'évaluation des risques et ce, au moins tous les trois ans. En cas de nécessité, l’évaluation des risques peut être réexaminée puis actualisée annuellement. Les mesures d'atténuation des risques sont incluses dans le plan de gestion. Veuillez consulter l'annexe A-11-SCRL-B-CH Outil d’Évaluation des risques.",
    groups: [
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Direction du groupe',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '1.3.2',
    description:
      "La direction élabore un Plan de gestion assorti des actions et buts à atteindre et qui se base sur l’Évaluation des risques (1.3.1) et l’auto-évaluation (1.4.2). Concernant les groupes, le plan de gestion s'appuie en outre sur l’inspection interne (1.4.1). La direction rend compte annuellement de la mise en œuvre du plan de gestion. Le plan de gestion est mis à jour chaque année. Veuillez consulter le SA-G-SD-3 Document d’orientation B : Modèle de plan de gestion.",
    groups: [
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Direction du groupe',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '1.3.3',
    description:
      "La direction fournit aux membres du groupe et aux travailleurs embauchés par le groupe des services basés sur le Plan de gestion. Les services peuvent inclure des formations, un appui technique, un appui à la tenue des registres, l'accès aux intrants (ex : des semences), des activités de sensibilisation, etc. La direction documente les services fournis. S’agissant des formations, les thématiques suivantes sont abordées au moins une fois par an : Bonnes pratiques relatives aux inspections internes, y compris les évaluations (pour tous les inspecteurs internes) ; Formation sur la stratégie de LIR, comme indiqué dans l’exigence 4.5.1 ; Santé et sécurité au travail et Procédures d’urgence. Veuillez consulter A-04-SCRL-B-CH - Annexe Gestion.",
    groups: ['Direction du groupe', 'Systeme de gestion interne (SGI)'],
  },
  {
    number: '1.3.4',
    description:
      'La direction fournit aux travailleurs des services basés sur le plan de gestion. Les services peuvent inclure des formations, des activités de sensibilisation, etc. La direction documente les services fournis. S’agissant des formations, les thématiques suivantes sont abordées au moins une fois par an : Formation sur la stratégie de LIR, comme indiqué dans l’exigence 4.5.1 ; Santé et sécurité au travail et Procédures d’urgence.',
    groups: [
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
    ],
  },
  {
    number: '1.4.1',
    description:
      'La direction met en place un système d’inspection interne pour évaluer annuellement la conformité de tous les acteurs dans le champ d’application de la certification. Le système contient : Pour les exploitations agricoles : les exploitations membres du groupe, les sites de transformation et/ou déstockage et autres acteurs pertinents (y compris les sous-traitants, les intermédiaires et les prestataires de services). Tous les acteurs sont soumis à une inspection interne avant le premier audit de certification et l’inspection interne couvre toutes les exigences applicables de la Norme. Après le premier audit de certification, l’inspection interne concerne : 100 % des grandes exploitations agricoles faisant partie d’un groupe ; Au moins 35 % des petites exploitations agricoles afin qu’elles aient toutes été inspectées au bout de trois ans ; Pour les exploitations avec plusieurs unités agricoles : Le choix de l’unité agricole à inspecter s’appuie sur son niveau de risque. La priorité est donnée aux unités agricoles qui n’ont pas déjà fait l’objet d’une inspection ; Tous les nouveaux acteurs font l’objet d’une inspection interne avant de rejoindre le groupe ; Pour les années qui suivront, les exigences couvertes par l’inspection interne seront basées sur l’évaluation des risques (pour les exploitations agricoles, voir 1.3.1), l’inspection interne de l’année précédente et sur les résultats des précédents audits externes. Veuillez consulter A-04-SCRL-B-CH - Annexe Gestion.',
    groups: ['Direction du groupe', 'Systeme de gestion interne (SGI)'],
  },
  {
    number: '1.4.2',
    description:
      'La direction réalise tous les ans une auto-évaluation de sa propre conformité et de celle de tous les acteurs de son champ d’application de la certification par rapport aux exigences pertinentes de la Norme. En ce qui concerne les groupes, la direction s’appuie sur les résultats des inspections internes comme établi dans l’exigence 1.4.1 afin de réaliser son auto-évaluation.',
    groups: [
      'Direction du groupe',
      'Systeme de gestion interne (SGI)',
      'Petites/Grandes exploitations agricoles',
    ],
  },
  {
    number: '1.4.3',
    description:
      "Un système d'approbation et de sanctions est en place pour garantir la conformité des membres du groupe avec la Norme pour l'Agriculture Durable de Rainforest Alliance. Le système contient : Une procédure écrite d’approbation et de sanction ; Un comité ou un responsable des approbations et des sanctions ; Un mécanisme de suivi des améliorations et des mesures correctives prises par les membres du groupe ; Une décision concernant le statut de chaque membre du groupe qui est signée, documentée et incluse dans le rapport final d'inspection interne.",
    groups: ['Direction du groupe', 'Systeme de gestion interne (SGI)'],
  },
  {
    number: '1.5.1',
    description:
      'Le Mécanisme de Réclamation mis en place permet aux individus, travailleurs, communautés, et/ou membres de la société civile, y compris les lanceurs d’alerte, de formuler une plainte concernant les activités du titulaire de certificat. Les réclamations peuvent concerner toute exigence incluse dans la Norme, y compris les problématiques techniques, sociales ou économiques. Le mécanisme de réclamation peut être fourni par le titulaire de certificat ou par un tiers. Le Mécanisme de Réclamation (voir exigence 1.1.1) doit inclure au moins les éléments suivants : Des représentants des membres du groupe ou des travailleurs doivent faire partie du comité ; Les plaintes peuvent être soumises dans toutes les langues et accessibles aux personnes sans compétences en lecture ou sans accès à Internet ; Les plaintes anonymes sont acceptées en toute confidentialité ; Les problèmes liés aux droits fondamentaux et aux droits du travail sont résolus dans le respect du Protocole de résolution ; Les plaintes et les mesures prises sont documentées et partagées en temps opportun avec les personnes affectées ; Les plaignants sont protégés contre les représailles. Veuillez consulter A-08-SCRL-B-CH Annexe Social et SA-G-SD-6 Document d’orientation E : Mécanisme de Réclamation.',
    groups: [
      'Petites/Grandes exploitations agricoles',
      'Direction du groupe',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '1.6.1',
    description:
      'La direction s’engage à promouvoir l’égalité des genres par : Une déclaration écrite communiquée aux membres du groupe ou aux travailleurs ; La nomination d’un comité (voir 1.1.1) responsable de la mise en œuvre, du suivi et de l’évaluation des mesures qui promeuvent l’égalité des genres et l’autonomisation des femmes ; L’inclusion dans le comité d’au moins un représentant de la direction doté d’un pouvoir de décision, et d’au moins une personne de chaque sexe. Remarque : Dans les groupes de petits exploitants agricoles, il est possible de désigner une personne responsable de ces questions plutôt qu’un comité. Voir SA-G-SD-7 Document d’orientation F : Égalité des genres.',
    groups: [
      'Petites/Grandes exploitations agricoles',
      'Direction du groupe',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '1.6.2',
    description:
      "La personne/le comité responsable : Met en œuvre les mesures qui promeuvent l’égalité des genres sur la base de l’Évaluation des risques et inclut ces mesures dans le Plan de gestion ; Sensibilise la direction et le personnel du groupe sur l’égalité des genres et l’autonomisation des femmes au moins une fois par an ; S’implique dans la remédiation des cas de violences et de discriminations basées sur le genre, conformément au Protocole de Remédiation. Veuillez consulter l'annexe A-11-SCRL-B-CH Outil d’Évaluation des risques et A-08-SCRL-B-CH Annexe Social.",
    groups: [
      'Petites/Grandes exploitations agricoles',
      'Direction du groupe',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '1.7.1',
    description:
      'La direction recueille des données précises sur les indicateurs pertinents pour la Norme de Rainforest Alliance, et les enregistre dans la Plateforme de Certification de Rainforest Alliance (RACP). Veuillez consulter A-10-SCRL-B-CH Annexe Indicateurs.',
    groups: [
      'Petites/Grandes exploitations agricoles',
      'Direction du groupe',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.1.1',
    description:
      "La production totale certifiée et la production certifiée de chaque agriculteur (en kg ou en tiges pour les fleurs) sont calculées une fois par an. Les calculs s’appuient sur une méthodologie fiable d’estimation des rendements (en kg/ha, en tiges/ha pour les fleurs) d'un échantillon représentatif d’exploitations agricoles ou d’unités agricoles. La méthodologie et les calculs sont documentés.",
    groups: [
      'Petites/Grandes exploitations agricoles',
      'Direction du groupe',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.1.2',
    description:
      'La direction fait annuellement le bilan de : La production totale récoltée certifiée (en kg, en tiges pour les fleurs) ; Le solde des produits achetés, produits, vendus et en stock. Si la différence entre la production estimée et la production réalisée est >15%, une justification raisonnable doit être donnée et des mesures doivent être prises pour empêcher la survenue de telles différences à l’avenir. Pour les groupes, les différences sont vérifiées et justifiées à la fois au niveau du groupe et au niveau individuel.',
    groups: [
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Direction du groupe',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.1.3',
    description:
      'Les produits certifiés selon la Norme Rainforest Alliance doivent être visuellement séparés des produits non certifiés, mais aussi séparés les uns des autres à chaque étape, y compris leur transport, leur stockage et leur transformation.',
    groups: [
      'Petites/Grandes exploitations agricoles',
      'Direction du groupe',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.1.4',
    description:
      "La Direction a cartographié le parcours des produits jusqu’à la destination finale du champ d'application du certificat, y compris tous les intermédiaires (points de collecte, transport, unités de transformation, entrepôts, etc.) et les activités réalisées sur le produit.",
    groups: [
      'Petites/Grandes exploitations agricoles',
      'Direction du groupe',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.1.5',
    description:
      "La traçabilité des produits certifiés peut remonter jusqu’à l’exploitation certifiée où ils ont été produits. La direction conserve les preuves d’achats et de ventes concernant les livraisons physiques provenant des produits certifiés, multi-certifiés et non certifiés. Elle s’assure que tous les intermédiaires font la même chose. Les documents d’achat et de vente affichent la date, le type de produit, le (pourcentage du) volume certifié, les informations sur le membre du groupe et, le cas échéant, le type de traçabilité. Dans le cas d'une certification de groupe, la direction du groupe garantit que les membres du groupe reçoivent un reçu pour chaque livraison du membre du groupe au groupe ou à un intermédiaire, en précisant le nom du membre du groupe, l’identité du membre du groupe, la date, le type de produit et le volume.",
    groups: [
      'Petites/Grandes exploitations agricoles',
      'Direction du groupe',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.1.6',
    description:
      'Les livraisons de produits certifiés ne dépassent pas la production totale (pour les exploitations agricoles), les achats de produits certifiés plus les stocks restants de l’année précédente.',
    groups: [
      'Petites/Grandes exploitations agricoles',
      'Direction du groupe',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.1.7',
    description:
      "Il n'y a pas de double vente des volumes. Dès qu'un volume est vendu sous la norme Rainforest Alliance, une norme conventionnelle, ou tout autre programme ou initiative de durabilité, il ne peut plus être mis en vente.",
    groups: [
      'Petites/Grandes exploitations agricoles',
      'Direction du groupe',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.1.8',
    description:
      "Les membres du groupe conservent les reçus des ventes (électronique ou physique), y compris le nom du membre du groupe, le numéro d'identification du membre, la date, le type de produit et le volume.",
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
    ],
  },
  {
    number: '2.1.9',
    description:
      'La méthodologie correcte utilisée pour le calcul des facteurs de conversion est démontrée et documentée pour chaque produit certifié et rapportée en conséquence dans la plateforme de traçabilité. S’applique aux grandes exploitations d’un groupe dès lors que la transformation fait partie de leur champ d’application.',
    groups: [
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.1.10',
    description:
      'L’équipement utilisé pour définir le poids ou le volume de produit certifié est calibré annuellement.',
    groups: [
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.2.1',
    description:
      'Toute activité liée au volume certifié (comme l’échange, le retrait, la vente, l’achat, la confirmation, etc.) doit être enregistrée sur la Plateforme de traçabilité de Rainforest Alliance dans les deux semaines suivant la fin du trimestre au cours duquel l’activité a eu lieu.',
    groups: [
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.2.2',
    description:
      'Les acheteurs de produits certifiés Rainforest Alliance ont une procédure en place pour vérifier régulièrement que les transactions sur la plateforme de traçabilité correspondent aux factures des produits certifiés.',
    groups: [
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.2.3',
    description:
      "L'approbation est obtenue avant l'utilisation de revendications destinées au public sur les emballages et hors emballages. Il existe des preuves que toute Revendication de produit certifié Rainforest Alliance faite est valide et conforme aux exigences du Programme de Certification Rainforest Alliance.",
    groups: [
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.2.4',
    description:
      'La Redevance est versée en totalité, sans aucune retenue fiscale, selon les modalités de paiement définies dans le Contrat de licence, les Termes et Conditions et/ou la Facture.',
    groups: [
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.3.1',
    description:
      'Les volumes sont uniquement convertis pour des processus qui peuvent avoir réellement lieu. La conversion d’un produit ne peut pas revenir au produit initial.',
    groups: [
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.3.2',
    description:
      'Les volumes vendus en bilan massique sont 100% couverts par les volumes achetés comme certifiés. Un bilan volumique négatif est systématiquement interdit.',
    groups: [
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.3.3',
    description:
      "Les volumes en bilan massique doivent toujours être accompagnés d'une expédition physique lorsqu'ils sont transférés entre Titulaires de Certificat. Le commerce de volumes sans expédition physique ne peut avoir lieu qu’entre des sites relevant du même certificat.",
    groups: [
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.3.4',
    description:
      'Les volumes vendus comme certifiés correspondent aux exigences minimums de pourcentage pour les informations sur l’origine. Ne s’applique qu’aux produits de cacao en bilan massique pour lesquels une correspondance des origines est requise.',
    groups: [
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '2.3.5',
    description:
      'La documentation des achats et des ventes de volumes vendus comme certifiés comporte les informations sur le pays d’origine pour les volumes entrants certifiés et non certifiés. Ne s’applique qu’aux produits de cacao en bilan massique pour lesquels une correspondance des origines est requise.',
    groups: [
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '3.1.1',
    description:
      'Le versement de la Prime doit être enregistré sur la Plateforme de traçabilité. Pour les cultures avec un minimum prescrit, le paiement doit atteindre au moins le minimum requis.',
    groups: [
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '3.1.2',
    description:
      "Les Titulaires de Certificat responsables doivent disposer de contrats ou d'accords signés précisant les montants à payer, ainsi que les modalités de paiement par période/cycle. La Prime ne peut pas être payée en nature et doit être intégralement versée selon les modalités de paiement par culture précisées dans l'Annexe Prime.",
    groups: [
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '3.1.3',
    description:
      'La Direction du groupe verse dûment et en temps opportun au moins 40 % de la prime en espèces ou via d’autres moyens de paiements monétaires aux membres du groupe, et ce avant la prochaine saison de récolte ou a minima une fois par an dans le cas des cultures à récolte ininterrompue. Les membres du groupe recevront une prime calculée au prorata des volumes récoltés. La direction du groupe documente et rend compte : • de la prime reçue par volume et au total ; • des montants versés aux membres du groupe ; • des utilisations faites de la prime par la direction du groupe, en pourcentage du total.',
    groups: ['Direction du groupe', 'Systeme de gestion interne (SGI)'],
  },
  {
    number: '3.1.4',
    description:
      'Toute prime versée doit être dépensée au bénéfice de l’agriculteur ou des travailleurs. La direction doit rendre compte : • de la prime reçue par volume et au total ; • de la répartition de la prime sous forme de pourcentage du montant reçu par volume ; et de la façon dont la prime bénéficie au producteur ou aux travailleurs.',
    groups: [
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '4.1.1',
    description:
      'Les variétés de plantes pour les plantations, le greffage et la rénovation sont sélectionnées en fonction de la qualité, de la productivité, de la résistance aux ravageurs et aux maladies et de leur adéquation au climat durant la durée de vie des plantes. Les matériaux de plantation sont indemnes de ravageurs et de maladies.',
    groups: [
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.1.2',
    description:
      "Pour les nouvelles plantations, les agriculteurs utilisent un système de culture éprouvé qui tient compte de plusieurs facteurs, notamment : • Les exigences de la variété utilisée • Les conditions agronomiques, écologiques et géographiques • La diversification et les cultures intercalaires avec différentes profondeurs de racines et d'usages des sols de sorte à améliorer leur qualité et leur santé. • La densité de plantation",
    groups: [
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.1.3',
    description:
      'S’appuyant sur la stratégie de LIR, les agriculteurs mettent en œuvre des mesures pour préserver les cultures des ravageurs et des maladies et pour casser leurs cycles biologiques, pour renforcer la santé des sols et améliorer la gestion des mauvaises herbes. Au nombre de ces mesures figurent des cultures intercalaires, et des mesures prises entre les cycles de cultures telles que la rotation des cultures ou la jachère.',
    groups: [
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.2.1',
    description:
      'Les agriculteurs mettent en place un cycle de taille pour la formation, l’entretien et le rajeunissement des cultures en fonction de leurs besoins, des conditions agroécologiques et des directives applicables sur la taille.',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.3.1',
    description: 'La culture certifiée n’est pas génétiquement modifiée (OGM).',
    groups: [
      'Direction du groupe',
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.4.1',
    description:
      'La direction réalise une évaluation du sol pour un échantillon représentatif de la zone et la met à jour au moins une fois tous les trois ans. L’évaluation du sol contient, le cas échéant : a. Zones sensibles à l’érosion et pentes b. Structure du sol c. Profondeur du sol et horizons du sol d. Densification des zones de compaction e. Humidité du sol et niveau d’eau dans le sol f. Conditions de drainage g. Les niveaux de macronutriments et de matière organique. Ces niveaux sont calculés à l’aide de tests du sol et/ou de l’observation des symptômes visuels d’une carence nutritive (tests sur les feuilles) sur un échantillon géographique représentatif. L’évaluation du sol est actualisée au moins une fois tous les trois ans. En ce qui concerne les cultures annuelles, les Niveaux de macronutriments et matière organique (voir Point g.) sont évalués chaque année.',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.4.2',
    description:
      'de l’observation des symptômes visuels d’une carence nutritive (tests sur les feuilles) sur un échantillon géographique représentatif. L’évaluation du sol est actualisée au moins une fois tous les trois ans. En ce qui concerne les cultures annuelles, les Niveaux de macronutriments et matière organique (voir Point g.) sont évalués chaque année.',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.4.3',
    description:
      'Les agriculteurs donnent la priorité aux engrais organiques fabriqués sur l’exploitation. En cas de besoins nutritifs supplémentaires, l’agriculteur peut y ajouter d’autres engrais organiques ou inorganiques. Le fumier animal est composté à chaud pour réduire les risques et stocké à au moins 25 mètres de toute source d’eau.',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.4.4',
    description:
      'Le sol dans la zone de production est protégé par des cultures de couverture, des résidus de cultures, du paillage ou d’autres méthodes afin d’éviter qu’il ne soit exposé.',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.4.5',
    description:
      'Des engrais sont appliqués pour garantir que les cultures bénéficient de suffisamment de nutriments au bon moment et au bon endroit afin de minimiser toute contamination environnementale.',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.4.6',
    description:
      'Les producteurs font le suivi et optimisent l’utilisation des engrais organiques et inorganiques.',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.5.1',
    description:
      'La direction documente et applique une stratégie de LIR élaborée par un professionnel compétent, notamment pour les installations de traitement. La stratégie englobe une prévention, un suivi, des niveaux de seuils et des mesures d’intervention. Elle s’appuie sur les conditions climatiques, les résultats du suivi des ravageurs, les mesures prises et les registres d’application des pesticides. La stratégie de LIR est mise à jour annuellement.',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.5.2',
    description:
      'S’appuyant sur la stratégie de LIR, les agriculteurs améliorent les écosystèmes naturels à proximité des zones de cultures pour fournir un habitat aux ennemis naturels. Il s’agit par exemple de créer des refuges à insectes, de planter des arbres et arbustes attirant les oiseaux/chauves-souris/pollinisateurs, de convertir des zones de basse altitude en petits étangs avec de la végétation, ainsi que d’améliorer des zones ripariennes et leur végétation.',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.6.1',
    description:
      'Aucun produit chimique répondant aux points suivants n’est utilisé : • Sur la Liste des pesticides interdits ou la Liste des pesticides obsolètes établies par Rainforest Alliance • Interdit par la législation applicable • Non inscrit légalement dans le pays où l’exploitation agricole est située. Les producteurs doivent uniquement utiliser des produits agrochimiques vendus par des revendeurs autorisés et conditionnés dans leur emballage d’origine hermétiquement scellé. Les substances chimiques utilisées pour le bétail ou les animaux domestiques ne sont pas incluses dans le champ d’application de la présente Norme. S’applique à la direction du groupe dans le cas où celle-ci est chargée d’effectuer des achats.',
    groups: [
      'Direction du groupe',
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.6.2',
    description:
      'Les agriculteurs qui utilisent des pesticides répertoriés dans la liste d’Atténuation des risques doivent appliquer toutes les pratiques concernées décrites dans l’Annexe Agriculture. Les agriculteurs qui utilisent des pesticides en vertu de la Politique d’utilisation exceptionnelle doivent respecter toutes les pratiques qui y sont décrites et appliquer la procédure de demande et de rédaction de comptes-rendus sur les exceptions accordées, comme indiqué dans l’Annexe.',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.6.3',
    description:
      'Le personnel qui manipule les pesticides est formé chaque année à leur préparation et leur application. Il utilise l’Équipement de protection individuelle (EPI) conformément à ce qui est indiqué sur le produit ou sur la Fiche de données de sécurité (FDS), ou porte une tenue basique de protection en fonction du risque lorsqu’aucune information n’est fournie. L’EPI doit être en bon état, nettoyé et stocké de façon sûre après utilisation. Il ne doit pas être rapporté au domicile du travailleur. Les articles à usage unique sont jetés après une utilisation. L’EPI est fourni gratuitement et la direction de l’exploitation/du groupe rend compte, surveille et fait respecter son usage.',
    groups: [
      'Direction du groupe',
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.6.4',
    description:
      'Les personnes manipulant les pesticides se lavent, se changent et lavent leurs vêtements après application. La direction doit mettre à leur disposition un endroit privé doté d’eau, de savons et, si possible, d’installations pour prendre une douche.',
    groups: [
      'Direction du groupe',
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.6.5',
    description:
      "Les pesticides sont préparés et appliqués selon le label, la FDS ou l’étiquette de sécurité, ou suivant les recommandations d'une organisation officielle nationale ou d’un technicien compétent, particulièrement par rapport : • à la sécurité du transport vers la zone d’application • au respect du dosage correct • à l'utilisation des équipements et des techniques appropriées • aux conditions météorologiques appropriées • au respect des délais de ré-entrée (DRE), dont des signaux de prévention dans les langues locales et l'information à l’avance des personnes ou des communautés potentiellement affectées. Lorsqu’il n’y a pas d’autres informations, le délai de réentrée minimum est de 48 heures pour les produits de la classe II de l’OMS et 12 heures pour les autres produits. Lorsque deux produits ou plus possédant des délais de ré- entrée différents sont utilisés en même temps, le délai le plus long s’applique. Les méthodes de calcul de dosage et de volume sont examinées et affinées afin de réduire les surplus de mélanges et l’usage excessif de pesticides. Les délais avant récolte après application des pesticides sont stipulés dans la FDS du produit, sur son label ou son étiquette de sécurité ou par les réglementations officielles auxquelles il faut se conformer. Lorsque deux produits ou plus possédant des délais avant récolte différents sont utilisés en même temps, le délai le plus long s’applique.",
    groups: [
      'Direction du groupe',
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.6.6',
    description:
      'Des mécanismes sont mis en place pour éviter les contaminations par les pesticides, via une dérive de pulvérisation ou d’autres façons, des zones traitées vers d’autres zones comme toutes les infrastructures et les écosystèmes naturels terrestres et aquatiques. Ces mécanismes consistent en des barrières végétatives non cultivées, des zones de non-application ou d’autres mécanismes efficaces.',
    groups: [
      'Direction du groupe',
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.6.7',
    description:
      "L’application aérienne est uniquement permise selon les conditions exposées en l'Annexe Agriculture.",
    groups: [
      'Direction du groupe',
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.6.8',
    description:
      'Les applications de pesticides sont enregistrées. Les enregistrements contiennent : • Nom de la marque du produit et ingrédient(s) actif(s) • Date et heure de l’application • Lieu et surface (taille) de l’application • Dosage et volume (organique ou inorganique) • Culture • Nom(s) des applicateurs • Ravageur ciblé. La direction du groupe facilite la tenue des dossiers pour les membres du groupe quand c’est nécessaire.',
    groups: [
      'Direction du groupe',
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.6.9',
    description:
      'Les contenants vides de pesticides et l’équipement d’application sont lavés trois fois et l’eau de rinçage est utilisée dans le dernier lot du mélange à appliquer sur la culture. Après l’application des pesticides, l’équipement d’application est lavé trois fois et tout mélange résiduel est dilué avec 10 fois la quantité d’eau propre puis réparti uniformément sur le champ traité afin de minimiser les impacts sur l’environnement et la santé. Les containers vides de pesticides sont conservés dans une zone sécurisée jusqu’à ce qu’ils puissent être éliminés sans danger par le biais d’une collecte adaptée, d’un programme de recyclage ou par leur renvoi au fournisseur. Si le fournisseur n’accepte pas les containers vides, ils doivent être coupés ou perforés pour empêcher d’autres utilisations. Les pesticides périmés, obsolètes ou interdits sont retournés au fournisseur ou à l’autorité locale. Si aucun système de collecte n’est disponible, ces produits sont étiquetés et stockés de manière sécurisée et séparée des autres produits dans un espace fermé à clé.',
    groups: [
      'Direction du groupe',
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.6.10',
    description:
      'Les produits agrochimiques et les équipements d’application sont stockés conformément aux indications des produits et de manière à minimiser les impacts négatifs sur l’environnement et la santé humaine. Les produits agrochimiques sont stockés dans leurs containers ou emballages d’origine. Les installations pour stocker les produits agrochimiques et les équipements d’application sont : • Sèches, propres, bien ventilées • Faites de matériaux non absorbants • Fermées à clé et accessibles uniquement par le personnel formé • Non accessibles aux enfants • Séparées des produits agricoles, des produits alimentaires et des matériaux d’emballage.',
    groups: ['Petites exploitations agricoles'],
  },
  {
    number: '4.6.11',
    description:
      "Les produits chimiques et les équipements d’application sont stockés conformément aux instructions du label et de manière à minimiser les impacts négatifs sur l’environnement et la santé humaine. Les produits agrochimiques sont stockés dans leurs containers ou emballages originaux. Les installations pour stocker les produits agrochimiques et les équipements d’application sont : • Sèches, propres, bien ventilées, avec un toit robuste et un sol imperméable • Fermées à clé et accessibles uniquement aux manipulateurs formés • Séparées des produits agricoles, des produits alimentaires ou des matériaux d’emballage • Avec un kit d’urgence en cas de fuite • Avec des signes et des pictogrammes préventifs de sécurité visibles et compréhensibles • Avec une procédure en cas d’urgence, une zone pour se laver les yeux et une douche en cas d'urgence. Pour les petites exploitations agricoles faisant partie d’un groupe, seule l’exigence 4.6.10 s’applique.",
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.6.12',
    description:
      'Un inventaire à jour du stock de pesticides est disponible et maintenu. L’inventaire contient : • Date d’achat • Nom de la marque du produit et ingrédient actif, dont une indication des produits agrochimiques qui sont sur la Liste d’atténuation des risques. • Volume • Date d’expiration. Pour les groupes, ceci ne s’applique que pour les stocks centralisés.',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.6.13',
    description:
      'L’équipement utilisé pour mélanger et appliquer les produits agrochimiques est calibré au moins une fois par an, après chaque session de maintenance et avant son utilisation avec un autre type de produit agrochimique.',
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '4.7.1',
    description:
      'Les produits sont manipulés de façon à optimiser leur qualité et leur quantité pendant et après la récolte comme lors de leur chargement, leur transformation, leur conditionnement, leur transport et leur stockage. Il s’agit notamment de : • Récolter les produits au bon moment pour une qualité optimale • Réduire les dommages causés aux plants pour la prochaine production • Prévenir toute contamination provenant de matières étrangères, de produits de nettoyage, de produits agrochimiques, de microbes et de ravageurs • Éviter les dommages causés par la moisissure • Stocker les produits dans un endroit frais, sec, sombre et bien aéré • Assurer la maintenance et le nettoyage des outils, des machines et des équipements utilisés pendant et après chaque récolte • Utiliser des matériaux adaptés et approuvés pour le conditionnement des produits alimentaires.',
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '4.7.2',
    description:
      'Les producteurs prennent des mesures pour respecter les Limites maximales de résidus (LMR) fixées par le pays de production et les pays de destination connus du produit. Il s’agit notamment des mesures suivantes : • Respecter rigoureusement les instructions des étiquettes des produits agrochimiques utilisés en post-récolte • Recueillir des informations sur les résidus dans le produit, via des tests (facultatif), ou des informations fournies par les acheteurs • Les actions à mener dans le cas où les LMR sont dépassées • Informer l’acheteur en cas de dépassement des LMR.',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.1.1',
    description:
      'La direction s’engage à évaluer-et-résoudre, le travail des enfants, le travail forcé, la discrimination et la violence et le harcèlement au travail en mettant en œuvre les points suivants : • Se coordonne avec le comité/la personne en charge des réclamations et questions liées au genre (voir exigence 1.1.1). • Sensibilise la direction et le personnel du groupe sur ces quatre problèmes, au moins une fois par an. • Informe les membres du groupe/travailleurs par écrit sur le fait que le travail des enfants, le travail forcé, la discrimination et la violence et le harcèlement au travail ne sont pas tolérés et que la direction possède un système actif pour évaluer et résoudre les problèmes qui y sont liés. Ces informations sont affichées en permanence et de manière visible dans les lieux principaux. Remarque : Dans les groupes de petits exploitants agricoles, il est possible de désigner une personne responsable de ces questions plutôt qu’un comité.',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.1.2',
    description:
      "Le comité/représentant de la direction inclut des mesures d'atténuation dans le plan de gestion. Le Titulaire de Certificat peut utiliser les mesures d'atténuation identifiées dans l'Évaluation des Risques de base et mettre en œuvre les mesures correspondantes.",
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.1.3',
    description:
      'Le comité ou le représentant de la direction inclut des mesures d’atténuation dans le plan de gestion, en s’appuyant sur l’évaluation des risques de base et en mettant en œuvre les mesures correspondantes.',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.1.4',
    description:
      'Dans le plan de gestion, le comité ou le représentant de la direction expose comment résoudre les cas de travail des enfants, de travail forcé, de discrimination et de violence et harcèlement au travail. Les cas confirmés sont résolus et documentés suivant le Protocole de résolution de Rainforest Alliance. La sécurité et la confidentialité des victimes sont protégées tout au long du processus.',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.1.5',
    description:
      'Au cours de la première année de certification, le comité ou représentant de la direction mène une Évaluation des risques dans le cadre de l’approche d’Évaluation et Résolution en ce qui concerne le(s) problème(s) à risque moyen ou élevé, incorpore les mesures d’atténuation correspondantes dans le plan de gestion, met en œuvre ces mesures. L’Évaluation des risques du système d’Évaluation et Résolution est effectuée au moins tous les trois ans',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.1.6',
    description:
      'Le comité ou représentant de la direction fournit des formations ou de la sensibilisation sur le travail des enfants, le travail forcé, la discrimination et la violence et le harcèlement au travail à tous les membres du groupe des petites exploitations agricoles ou aux travailleurs des grandes exploitations agricoles ou des exploitations agricoles certifiées individuellement',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.1.7',
    description:
      'La direction met en place des mesures pour garantir que les enfants du personnel du groupe, des membres du groupe et des travailleurs aillent bien à l’école',
    groups: ['Direction du groupe', 'Systeme de gestion interne (SGI)'],
  },
  {
    number: '5.1.8',
    description:
      'La direction assure bon fonctionnement du système d’Évaluation-et-Résolution À cette fin à partir de la première année une évaluation annuelle du système d’Évaluation-et-Résolution pour les problèmes appropriés est réalisée en fonction des cinq éléments suivants Mise en œuvre efficace des mesures d’atténuation Formation efficace sur les sujets appropriés de l’Évaluation-et-Résolution Coopération efficace avec les acteurs externes Suivi efficace du système d’Évaluation-et-Résolution Collaboration interne efficace sur les sujets de l’Évaluation-et-Résolution',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.2.1',
    description:
      'Les travailleurs peuvent créer et rejoindre les organisations syndicales ou organisations de travailleurs de leur choix et participer aux conventions collectives sans avoir à demander l’approbation de leur employeur conformément à la législation applicable Les représentants des travailleurs sont élus démocratiquement lors d’élections libres et justes organisées régulièrement La direction dispose d’une politique écrite sur les droits des travailleurs et s’assure que ces derniers la comprennent Elle affiche toujours cette politique de façon visible sur le lieu de travail Si des lois limitent la liberté d’association et les conventions collectives la direction soutient la mise en place de méthodes alternatives d’association libre et indépendante de convention collective et de dialogue avec les travailleurs Convention de l’OIT (n° 87) sur la liberté d’association et la protection du droit syndical 1948 Recommandation de l’OIT (n° 143) concernant les représentants des travailleurs 1971 Pour les Petites exploitations agricoles l’exigence s’applique uniquement si elles embauchent 10 travailleurs temporaires ou plus intervenant chacun pendant 3 mois consécutifs ou plus et/ou 50 travailleurs temporaires ou plus par année calendaire',
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.2.2',
    description:
      "Les travailleurs sont protégés contre les discriminations ou les représailles survenant en raison de leurs activités syndicales La direction ne sanctionne pas ne soudoie pas et n'influence pas les membres des syndicats ou les représentants des travailleurs Les documents de fin de contrat doivent inclure un motif et les affiliations syndicales du travailleur en question La direction ne doit en aucun cas intervenir dans les organisations des travailleurs leurs élections ou l'exercice de leurs fonctions Convention de l’OIT (n° 98) sur le droit d'organisation et de négociation collective 1949 Recommandation de l’OIT (n° 143) concernant les représentants des travailleurs 1971 Pour les Petites exploitations agricoles l’exigence s’applique uniquement si elles embauchent 10 travailleurs temporaires ou plus intervenant chacun pendant 3 mois consécutifs ou plus et/ou 50 travailleurs temporaires ou plus par année calendaire",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.2.3',
    description:
      "La direction fournit aux représentants des travailleurs des heures rémunérées raisonnable en dehors de leur travail pour mener à bien leurs fonctions syndicales et participer aux réunions Au besoin la direction fournit aux représentants des travailleurs des ressources adéquates telles qu'un espace de réunion des outils de communication et des services de garde d'enfants La direction autorise les organisations de travailleurs et/ou les syndicats à utiliser un tableau d’affichage pour publier des informations sur leurs activités La direction établit un dialogue avec les représentants des travailleurs choisis librement afin d’aborder collectivement et de discuter des questions concernant les conditions de travail et les conditions d’emploi La direction archive les procès-verbaux des réunions avec les organisations de travailleurs et/ou syndicats Convention de l’OIT (n° 135) concernant les représentants des travailleurs 1971 Recommandation de l’OIT (n° 143) concernant les représentants des travailleurs 1971 Pour les Petites exploitations agricoles l’exigence s’applique uniquement si elles embauchent 10 travailleurs temporaires ou plus intervenant chacun pendant 3 mois consécutifs ou plus et/ou 50 travailleurs temporaires ou plus par année calendaire",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.3.1',
    description:
      "Les travailleurs employés pendant 3 mois consécutifs ou plus doivent avoir un contrat écrit signé par les deux parties Les travailleurs employés pendant moins de 3 mois doivent avoir au minimum un contrat verbal l'employeur devant conserver des archives de ces contrats Les contrats écrits pour les travailleurs employés pendant 3 mois consécutifs ou plus incluent Obligations professionnelles Lieu de travail Horaires de travail Taux de rémunération/méthode de calcul Taux de rémunération des heures supplémentaires Calendrier de paiement Déductions et avantages Congés payés Congés maladie et protections en cas de maladie de handicap ou d’accident Période de préavis en cas de licenciement Les documents contractuels verbaux comprennent Horaires de travail Taux de rémunération Rémunération des heures supplémentaires Avant de commencer leur travail tous les travailleurs doivent comprendre leur contrat de travail et peuvent en demander une copie à tout moment Pour les Petites exploitations agricoles l’exigence s’applique uniquement si elles embauchent 10 travailleurs temporaires ou plus intervenant chacun pendant 3 mois consécutifs ou plus et/ou 50 travailleurs temporaires ou plus par année calendaire",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.3.2',
    description:
      "Aucune politique et/ou arrangement n'est en place pour réduire le salaire ou les avantages des travailleurs par exemple en recourant à des travailleurs temporaires pour des tâches permanente",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.3.3',
    description:
      'La direction et les producteurs respectent les conventions collectives CC en lien avec la norme Rainforest Alliance Les travailleurs reçoivent au moins le salaire minimum applicable ou le salaire prévu dans un CC en fonction du montant le plus élevé Pour la production les quotas ou le travail à la pièce le paiement doit être d’au moins le salaire minimum basé sur une semaine de travail de 48 heures ou sur la limite nationale légale d’heures de travail le plus faible prévalant',
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.3.4',
    description:
      'Les prélèvements sur les salaires pour la sécurité sociale ne sont autorisées que si elles sont prévues par la loi applicable ou un CC Les prélèvements volontaires telles que les paiements anticipés ou les prêts nécessitent le consentement du travailleur Les employeurs doivent traiter ces remises de manière complète et dans les délais impartis Les prélèvements salariales disciplinaires sont interdites Les prélèvements pour les outils ou équipements ne sont autorisées que si elles sont légalement permises Les avantages en nature doivent être conformes à la loi et ne peuvent pas dépasser 30 % du salaire total',
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.3.5',
    description:
      "Les travailleurs sont rémunérés à des intervalles réguliers conformément à l'accord entre le travailleur et l'employeur avec une fréquence minimale d'une fois par mois Des registres détaillés sont maintenus pour chaque travailleur comprenant les heures travaillées régulières et supplémentaires le volume de production le cas échéant les calculs salariaux les déductions et les paiements réalisés Les travailleurs reçoivent un justificatif au format papier ou électronique contenant les informations précédentes Convention de l’OIT n° 95 sur la Protection des Salaires 1949 Pour les Petites exploitations agricoles l’exigence s’applique uniquement si elles embauchent 10 travailleurs temporaires ou plus intervenant chacun pendant 3 mois consécutifs ou plus et/ou 50 travailleurs temporaires ou plus par année calendaire",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.3.6',
    description:
      "Les travailleurs accomplissant un travail de valeur équivalente reçoivent une rémunération égale sans discrimination basée sur des critères tels que le genre le type de travailleur l'ethnie l'âge la couleur la religion l'opinion politique la nationalité l'origine sociale ou d'autres facteurs Convention de l’OIT n° 100 sur l’égalité de rémunération 1951",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.3.7',
    description:
      'Si des agences de placement de main-d’œuvre sont utilisées la direction garde des enregistrements de leur nom leurs coordonnées et leur numéro d’inscription le cas échéant Agences de placement de main-d’œuvre n’est pas engagée dans des pratiques de recrutement frauduleuses ou coercitives respecte les exigences 5.3 et 5.5 applicables de cette norme liées aux travailleurs Tous les frais de recrutement sont payés par l’exploitation agricole et non par les travailleurs Convention de l’OIT n° 181 sur les agences d’emploi privées 1997',
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.3.8',
    description:
      "Dans les pays où il n'y a pas d'ajustements annuels du salaire minimum ou de régulations relatives aux CC les salaires des travailleurs sont ajustés chaque année en fonction de l'inflation suivant le taux national",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.4.1',
    description:
      "Chaque année la direction évalue la rémunération totale salaires primes et avantages de tous les travailleurs par rapport au seuil du Salaire minimum Vital approuvé par Rainforest Alliance et conformément aux normes du Global Living Wage Coalition GLWC ou à tout autre référentiel reconnu Cela ne s'applique pas aux travailleurs des petites exploitations agricoles appartenant à un groupe",
    groups: [
      'Direction du groupe',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '5.5.1',
    description:
      'Si des agences de placement de main-d’œuvre sont utilisées la direction garde des enregistrements de leur nom leurs coordonnées et leur numéro d’inscription le cas échéant Agences de placement de main-d’œuvre n’est pas engagée dans des pratiques de recrutement frauduleuses ou coercitives respecte les exigences 5.3 et 5.5 applicables de cette norme liées aux travailleurs Tous les frais de recrutement sont payés par l’exploitation agricole et non par les travailleurs Convention de l’OIT n° 181 sur les agences d’emploi privées 1997',
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.5.2',
    description:
      "Les heures supplémentaires sont volontaires et uniquement autorisées si a C’est demandée en temps opportun b C’est rémunéré conformément à la législation nationale ou au CC selon ce qui est le plus élevé si aucun des deux n'existe rémunéré au moins 1,5 fois le salaire régulier c Cela n'accroît pas les risques pour la santé et la sécurité les taux d'incidents liés aux heures supplémentaires sont suivis et réduits si nécessaire d Les travailleurs disposent d'un transport sécurisé pour rentrer chez eux e La durée totale de la semaine de travail ne dépasse pas 60 heures sauf dans des cas exceptionnels f Les travailleurs ont droit à une pause de 30 minutes après 6 heures de travail et à un repos d'au moins 10 heures consécutives chaque période de 24 heures g Un registre des heures régulières et des heures supplémentaires est tenu h Pour certaines activités telles que la récolte qui doivent être accomplies dans une fenêtre de temps limitée de jusqu'à 6 semaines les heures supplémentaires peuvent atteindre 24 heures par semaine pendant un maximum de 12 semaines par an et les travailleurs peuvent être amenés à travailler jusqu'à 21 jours consécutifs Des conditions s'appliquent dans des situations particulières Convention de l’OIT n° 1 sur la durée du travail industrie 1919 Convention de l’OIT n° 30 sur la durée du travail commerce et bureaux 1930 Recueil de directives pratiques de l’OIT sur santé et sécurité en agriculture 2010 Conférence Internationale sur le Travail 107éme Session 2018 Étude générale sur les outils liés au temps de travail Pour les petites exploitations agricoles l’exigence s’applique uniquement si elles embauchent 10 travailleurs temporaires ou plus intervenant chacun",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },

  {
    number: '5.5.3',
    description:
      "Les travailleurs permanents ont droit à un congé parental payé conformément à la loi applicable En l’absence de législation applicable les travailleuses reçoivent un congé maternité payé d'au moins 12 semaines dont au moins six semaines sont prises après la naissance Elles peuvent reprendre leur travail après le congé de maternité dans les mêmes termes et conditions et sans discrimination perte d’ancienneté ou déduction de salaire Les travailleuses qui sont enceintes qui allaitent ou qui ont récemment accouché reçoivent des emplois du temps flexibles et des adaptations sur le lieu de travail Les femmes qui allaitent ont deux pauses supplémentaires de 30 minutes par jour et un lieu pour allaiter l’enfant Convention de l’OIT n° 183 sur la protection de la maternité 1952 Pour les Petites exploitations agricoles l’exigence s’applique uniquement si elles embauchent 10 travailleurs temporaires ou plus intervenant chacun pendant 3 mois consécutifs ou plus et/ou 50 travailleurs temporaires ou plus par année calendaire",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.5.4',
    description:
      "Les enfants des travailleurs qui sont en dessous de l'âge minimum de travail applicable et qui accompagnent leurs parents sur le lieu de travail doivent se voir fournir un espace sécurisé adapté à leur âge Être sous surveillance continue d'adultes en tout temps Recueil de directives pratiques de l’OIT sur santé et sécurité en agriculture 2010",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.6.1',
    description:
      "La direction en collaboration avec le personnel ou des experts externes disposant des compétences techniques requises procède à une analyse des risques liés à la santé et à la sécurité au travail dans le champ d’application de la certification Le plan de gestion définit les mesures pertinentes et veille à leur mise en œuvre en tenant compte au moins des éléments suivants Analyse des risques Conformité avec les réglementations Formation des travailleurs Procédures et équipement pour garantir la santé et la sécurité Pour une utilisation sûre des machines La fréquence et la nature des incidents de santé et de sécurité au travail y compris ceux liés à l'utilisation de produits agrochimiques sont documentées et détaillées pour les hommes et les femmes Les mesures prises pour prévenir la récurrence des incidents sont également documentées Convention de l’OIT n° 155 sur la sécurité et la santé des travailleurs 1981 Convention de l’OIT n° 184 sur la sécurité et la santé dans l'agriculture 2001",
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.6.2',
    description:
      "Des kits de premiers secours sont disponibles pour traiter les blessures liées au travail avec des soins d'urgence gratuits et un transport hospitalier Ils sont placés à des emplacements centraux sur les sites de production de traitement et de maintenance Des douches d'urgence et des lavages oculaires sont également installés dans les zones où ils sont requis Des employés formés aux premiers secours sont disponibles pendant les heures de travail et les travailleurs sont informés des lieux où chercher de l'aide en cas d'urgence Pour les Petites exploitations agricoles l’exigence s’applique uniquement si elles embauchent 10 travailleurs temporaires ou plus intervenant chacun pendant 3 mois consécutifs ou plus et/ou 50 travailleurs temporaires ou plus par année calendaire",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.6.3',
    description:
      "Les membres du groupe et les travailleurs connaissent les procédures d'urgence Des panneaux d'avertissement et des instructions de sécurité sont affichés clairement Les travailleurs peuvent quitter une situation de danger imminent sans autorisation ni pénalité",
    groups: ['Petites exploitations agricoles'],
  },
  {
    number: '5.6.4',
    description:
      'Les travailleurs ont accès à de l’eau potable suffisante et sûre à tout moment via un système public d’eau potable ou de l’eau potable fournie par la direction et testée au moins une fois tous les trois ans ou plus souvent si l’analyse de risque a conclu qu’il existait un risque de contamination La direction assure la disponibilité de l’eau potable d’un système de distribution et des réservoirs pour éviter toute contamination L’eau potable fraîche stockée dans des jarres ou des containers est protégée de la contamination par un couvercle et elle est renouvelée au moins toutes les 24 heures',
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.6.5',
    description:
      "Dans les petites exploitations sans eau potable la direction forme et guide les membres du groupe sur les techniques de traitement de l'eau telles que l'ébullition la filtration ou la chloration et sur les pratiques visant à éviter la contamination",
    groups: ['Direction du groupe', 'Systeme de gestion interne (SGI)'],
  },
  {
    number: '5.6.6',
    description:
      'Les travailleurs ont toujours accès à une eau potable en quantité suffisante',
    groups: ['Petites exploitations agricoles'],
  },
  {
    number: '5.6.7',
    description:
      "Des toilettes propres adéquates et en bon état de fonctionnement ainsi que des stations de lavage des mains sont accessibles sur ou à proximité des sites de production agricole de transformation de maintenance des bureaux et des logements des travailleurs lorsque le nombre de travailleurs est de 10 ou plus les installations sont séparées par genre les urinoirs étant distincts des toilettes réservées aux femmes la sécurité et l’intimité des groupes vulnérables sont garanties par des installations bien éclairées et qu’on peut fermer à clé les travailleurs peuvent accéder à ces installations à tout moment lorsqu'ils en ont besoin",
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.6.8',
    description:
      "Les travailleurs confrontés à des conditions dangereuses telles que des terrains difficiles l'utilisation de machines ou la manipulation de matériaux dangereux portent des Equipements de Protection Individuelle EPI fournis gratuitement et bénéficient d'une formation sur leur utilisation",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.6.9',
    description:
      "Lorsqu’ils ne sont pas utilisés les machines et autres équipements sont stockés de manière sécurisée tous les outils utilisés par les travailleurs sont en bon état de fonctionnement les machines sont accompagnées d'instructions claires et compréhensibles pour garantir une utilisation sécurisée et les parties dangereuses sont protégées ou isolées les travailleurs qui utilisent ces machines reçoivent une formation adéquate et détiennent les licences nécessaires exigées par la loi",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.6.10',
    description:
      'Les travailleuses qui sont enceintes qui allaitent ou qui ont accouché récemment ne sont pas assignées à des activités qui posent un risque pour la santé de l’enfant de l’enfant à naître ou de la femme en cas de réaffectation de travail il n’y a pas de réduction de la rémunération aucun test de grossesse n’est imposé',
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.6.11',
    description:
      "Les ateliers les zones de stockage et les installations de transformation sont sûrs propres bien éclairés et ventilés une procédure écrite pour les accidents et les urgences inclut des sorties de secours bien indiquées des plans d'évacuation ainsi qu'un exercice d'urgence annuel la direction informe les travailleurs sur cette procédure des équipements de lutte contre les incendies et de nettoyage des déversements sont fournis et les travailleurs reçoivent une formation sur leur utilisation seul le personnel autorisé a accès aux ateliers aux installations de stockages ou aux installations de transformation",
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.6.12',
    description:
      'Les travailleurs dans les ateliers les istallations de transformation et les zones de stockage possèdent des lieux pour manger propres et sécurisés qui les protègent du soleil et de la pluie les travailleurs des champs peuvent également manger dans des zones abritées du soleil et de la pluie',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.6.13',
    description:
      'Les travailleurs qui manipulent des produits agrochimiques dangereux subissent un examen médical annuel en cas d’exposition régulière aux pesticides organophosphorés ou carbamates lexamen inclut un test de cholinestérase Les travailleurs ont accès aux résultats de leur examen médical',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
      'Petites exploitations agricoles',
    ],
  },
  {
    number: '5.7.1',
    description:
      "Les travailleurs et leurs familles qui sont logés ou hébergés sur site possèdent des quartiers de vie sécurisés propres et adéquats suivant les conditions locales Cela comprend les éléments suivants Emplacement et construction Une construction sûre située dans un endroit protégé des risques avec une protection contre les intempéries extrêmes des sols secs des murs solides et en bon état Les sols secs doivent être surélevés par rapport au sol et réalisés en ciment pierre carrelage bois ou en argile scellée et nivelée Protection contre la pollution de l’air et les ruissellements de surface des eaux usées Les travailleurs familles sont informées quant aux plans d’évacuation en cas d’urgence Les logements collectifs disposent de voies d’évacuation balisées d’un équipement en cas d’incendie qui soit installé et fonctionnel ainsi que d’instructions d’utilisation de cet équipement Santé et hygiène Disponibilité en eau potable suffisante au minimum 20 litres par adulte par jour à moins de 1 km de distance ou 30 minutes aller-retour La sécurité et l’intimité des groupes vulnérable sont garanties par des installations bien éclairées et qu’on peut fermer à clé Les installations sanitaires sont situées dans les mêmes bâtiments ou à une distance sécurisée pas plus de 60 mètres des chambres dortoirs et sont séparées pour les hommes et les femmes Des égouts fermés ou des latrines à fosse adaptés ainsi que des installations sanitaires et d’élimination des déchets Zones de cuisine avec ventilation des fumées Mesures de lutte contre les ravageurs pour empêcher la présence de rats souris insectes et autres animaux pouvant propager des maladies ou des parasites Confort et décence Les familles des travailleurs permanents ayant des enfants disposent de chambres séparées de celles des travailleurs sans membres de famille Les enfants des travailleurs vivant sur le site sont dans un endroit sécurisé et sous la supervision d'un adulte durant les heures de travail L'électricité est disponible sur place ou à proximité si elle est disponible dans la région Pour les logements collectifs Des chambres séparées et verrouillables des installations de lavage et des toilettes distinctes pour les hommes et les femmes Chaque travailleur dispose d'un lit individuel avec un espace d'au moins 1 mètre entre les lits Si des lits superposés sont utilisés il doit y avoir un espace libre d'au moins 0,7 mètre entre les lits Un espace de stockage pour les affaires personnelles est fourni soit un placard individuel soit au moins 1 mètre d’étagère par travailleur Recommandation de l’OIT (n° 115) sur le logement des travailleurs 1961 Recueil de directives pratiques de l’OIT sur santé et sécurité en agriculture 2010 Veuillez consulter le SA-G-SD-13 Document d’orientation K Conditions de vie et de logement",
    groups: [
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '5.7.2',
    description:
      "Les enfants vivant sur le site et en âge d'être scolarisés vont à l’école Ils doivent soit Fréquenter une école accessible à pied en toute sécurité Fréquenter une école située à une distance raisonnable avec un transport sécurisé Recevoir une éducation sur place équivalente et reconnue",
    groups: [
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '5.7.3',
    description:
      "Les travailleurs et leurs familles qui sont logés ou hébergés sur site possèdent des quartiers de vie sécurisés propres et décents suivant les conditions locales Ces difficultés incluent notamment Un logement sûr situé dans des zones non dangereuses offrant une protection contre les intempéries des sols secs des murs permanents et des structures bien entretenues Les voies d’évacuation sont marquées pour les logements des groupes Des mesures de protection contre la pollution de l'air et le ruissellement de surface accompagnées d'infrastructures adéquates pour la gestion des eaux d’égout l'assainissement et l'élimination des déchets Accès à l’eau potable sécurisée Installations sanitaires et de lavage appropriées offrant sécurité et intimité aux groupes vulnérables grâce à des équipements bien éclairés et verrouillables Recommandation de l’OIT (n° 115) sur le logement des travailleurs 196",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '5.8.1',
    description:
      "Les conditions de vie sur le site se sont améliorées par Emplacement et Construction Mesures mises en place pour atténuer les impacts des conditions climatiques extrêmes tels que les inondations Une ventilation naturelle garantit une circulation d'air adéquate par tous les temps Santé et hygiène Installations sanitaires adéquates Latrines améliorées ventilées ou toilettes raccordées à des systèmes d'eaux usées ou d'égouts Installations 1 toilette urinoir station de lavage des mains et douche pour 15 personnes Les dispositifs de lavage de mains comprennent un robinet et une cuvette Chambres à l’écart des fumées dégagées par les cuisines Lumière naturelle et artificielle Confort et décence Espaces couverts ou confortables pour les repas et les pauses respectant les coutumes Logements Collectifs Lits superposés limités à deux niveaux Espace de vie augmenté pour les logements des groupes",
    groups: [
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '5.8.2',
    description:
      "Le producteur bénéficie d’un droit légal ou légitime d’utilisation des terres justifié par la propriété la location à bail ou d’autres documents légaux ou par la documentation de droits d'utilisation coutumiers ou traditionnels Les droits d'usage traditionnels ou coutumiers lorsqu'ils sont vérifiables peuvent également être considérés Si les Peuples autochtones et/ou communautés locales résidents locaux actuels ou passés ou d’autres parties prenantes contestent légitimement un droit d’utilisation des terres par exemple en cas d’une dépossession passée d’un abandon forcé ou d’une action illégale le titulaire de certificat pourrait devoir prouver qu’il possède un droit légitime d’utilisation des terres si a Un processus de résolution et réparation d’un conflit a été créé mis en œuvre et accepté par les parties impactées b Dans le cas d’une action illégale les autorités concernées sont comptées comme des parties impactées c Si le conflit implique des peuples autochtones et les communautés locales les grandes exploitations agricoles et les exploitations agricoles certifiées individuellement suivent un processus de CPLCC Veuillez consulter A-08-SCRL-B-CH Annexe Social Veuillez consulter le SA-G-SD-45 Document d’orientation T Processus du Consentement Préalable donné Librement et en Connaissance de Cause CPLCC",
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '5.8.3',
    description:
      'La direction respecte les droits légaux et coutumiers des peuples autochtones et des communautés locales Toute activité impactant leurs terres ressources ou intérêts y compris les Hautes Valeurs de Conservation HVC 5 ou 6 doit obtenir leur consentement libre préalable et éclairé CPLCC Convention de l’OIT n° 169 relative aux peuples indigènes et tribaux 1989',
    groups: [
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.1.1',
    description:
      'Depuis le 1er janvier 2014 les forêts naturelles et les autres écosystèmes naturels n’ont pas été convertis pour la production agricole ou pour d’autres usages des terres',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.1.2',
    description:
      'La production ou la transformation n’a pas lieu dans les aires protégées ou leurs zones tampons désignées officiellement sauf là où elle est conforme à la législation applicable',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.1.3',
    description:
      "Le plan de gestion inclut des mesures d'atténuation issues de l'outil d'Évaluation des Risques (1.3.1) pour les Hautes Valeurs de Conservation (1.3.2). La direction met en œuvre ces mesures",
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.2.1',
    description:
      'La direction élabore et met en œuvre un plan pour conserver les écosystèmes naturels. Le plan se base sur la carte requise dans l’exigence 1.2.9 et la section sur les écosystèmes naturels de l’Outil d’Évaluation des Risques dans l’exigence 1.3.1 et est mis à jour annuellement',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.2.2',
    description:
      "Les exploitations préservent tous les arbres forestiers restants, sauf s'ils représentent un danger pour les personnes ou les infrastructures. Les autres arbres indigènes de l’exploitation agricole sont gérés durablement de manière que la même quantité et la même qualité d’arbres soient maintenues",
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.2.3',
    description:
      "Les producteurs maintiennent le couvert de végétation naturelle et la direction en fait le suivi et rédige des rapports annuels. Si moins de 10 % de la superficie totale est recouverte de végétation naturelle, ou moins de 15 % pour les exploitations cultivant des cultures tolérantes à l'ombre, la direction définit des objectifs et prend des mesures pour que les exploitations atteignent ces seuils conformément à l'exigence 6.2.4. La végétation naturelle peut inclure l'un ou plusieurs des types suivant (non exclusifs) : Zones ripariennes tampons, Zones de conservation au sein de l’exploitation agricole, Végétation naturelle dans les systèmes agroforestiers, Plantations aux niveaux des limites/frontières, barrières et palissades vivantes autour des logements et des infrastructures ou d’une autre manière, Zones de conservation et de restauration en dehors de l’exploitation agricole certifiée qui fournissent effacement une protection à long terme des zones concernées (pour au moins 25 ans) et produisent une valeur de conservation et un statut de protection supplémentaires au statu quo",
    groups: [
      'Direction du groupe',
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.2.4',
    description:
      'Il y a une couverture de végétation naturelle sur au moins 10% de la surface totale des exploitations agricoles cultivant des cultures non tolérantes à l’ombre et sur au moins 15% de la surface totale des exploitations agricoles cultivant des cultures tolérantes à l’ombre',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.3.1',
    description:
      'Les exploitations agricoles maintiennent les zones ripariennes tampons existantes adjacentes aux écosystèmes aquatiques',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.3.2',
    description:
      "Les producteurs maintiennent les dispositifs de sécurité supplémentaires suivants pour la protection de l’eau potable dans le cas où l’exploitation agricole est située à moins de 50 m d’une rivière, d'un lac ou d'une autre étendue d’eau qui est fréquemment utilisée comme source principale d’eau de boisson. Maintenir ou établir une zone riparienne tampon qui a une largeur d’au moins 10 mètres. Ajouter une zone extérieure supplémentaire de 20m de non-application (total 30m) où aucun pesticide ni engrais n’est utilisé. Ajouter une zone supplémentaire de 20m (entre 30 et 50m de l’étendue d’eau) dans laquelle les pesticides sont appliqués uniquement via une application ciblée, mécanique ou manuelle",
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.3.3',
    description:
      'Les écosystèmes aquatiques sont entourés de zones ripariennes tampons possédant les paramètres de largeur de zones ripariennes tampons suivants : 5 m de largeur horizontale le long des deux côtés des cours d’eau mesurant entre 1 et 5 m de large. Pour les exploitations agricoles < 2 ha, la largeur de la zone riparienne tampon peut être réduite à 2 m sur les deux côtés. 8 m de largeur horizontale le long des deux côtés des cours d’eau mesurant entre 5 et 10 m de large, et autour des sources d’eau, des zones humides et des autres étendues d’eau. 15 m de largeur horizontale le long des deux côtés des rivières mesurant plus de 10 mètres de large. Aucune zone de non-application supplémentaire n’est requise le long des zones ripariennes tampons totalement établies',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.4.1',
    description:
      'Les petites exploitations agricoles peuvent chasser les animaux non menacés uniquement pour des usages personnels. Les vertébrés nuisibles peuvent être chassés dans l’exploitation agricole, conformément au plan Lutte intégrée contre les ravageurs LIR, en dernier recours. Les substances toxiques ou explosives ne sont jamais utilisées pour la chasse, la pêche ou pour la lutte contre les nuisibles',
    groups: [
      'Direction du groupe',
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.4.2',
    description:
      'Les producteurs ne maintiennent pas la faune sauvage en captivité. Les animaux sauvages captifs qui étaient présents sur l’exploitation agricole avant la première date de certification sont envoyés dans des refuges professionnels ou peuvent être gardés uniquement pour des raisons non commerciales pour le restant de leurs vies',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.4.3',
    description:
      "Les producteurs évitent d'introduire ou de libérer intentionnellement des espèces envahissantes. Les producteurs ne relâchent pas d’espèces envahissantes existantes ou leurs parties dans les écosystèmes aquatiques",
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.4.4',
    description:
      'Les producteurs n’utilisent pas la faune sauvage pour la transformation ou la récolte des cultures agricoles (ex : les civettes pour le café, les singes pour les noix de coco, etc.)',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.4.5',
    description:
      'L’érosion par l’eau et le vent est réduite via des pratiques telles que la revégétalisation des zones en pentes et l’aménagement en terrasses',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.4.6',
    description:
      'Le feu n’est pas utilisé pour préparer ou nettoyer les champs, sauf lorsqu’il est spécifiquement justifié dans le plan de PIC',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.5.1',
    description:
      'Le feu n’est pas utilisé pour préparer ou nettoyer les champs, ' +
      'sauf lorsqu’il est spécifiquement justifié dans le plan de PIC.',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.5.2',
    description:
      "Les systèmes d'irrigation et de distribution de l'eau sont entretenus pour maximiser les rendements des cultures tout en réduisant le gaspillage d'eau, l'érosion des sols et la salinisation.",
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.5.3',
    description:
      "Les systèmes d'irrigation et de distribution d'eau sont gérés de manière à optimiser la productivité des cultures, en tenant compte de facteurs tels que : l’évapotranspiration des cultures à différentes étapes de leur croissance, les conditions des sols, les modalités des pluies. Non applicable aux petites exploitations agricoles en groupe : Les producteurs enregistrent la quantité d’eau utilisée pour l’irrigation à partir de la première année.",
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.5.4',
    description:
      'La direction prend des mesures pour réduire l’utilisation de l’eau utilisée pour la transformation par unité de produit. L’utilisation et la réduction de l’eau sont suivies et documentées dès la première année. Pour la Direction du groupe, c’est applicable si les groupes possèdent des installations de transformation centrales.',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.5.5',
    description:
      'Les producteurs utilisent les eaux de pluie collectées pour l’irrigation et/ou à des fins agricoles.',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.5.6',
    description:
      'Les producteurs participent à une initiative ou à un comité local du bassin versant et prennent des mesures pour aider à maintenir ou à restaurer la santé du bassin versant dans le cadre de ce processus collectif. La nature de la participation et les actions entreprises sont documentées.',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.6.1',
    description:
      'Des tests des eaux usées issues des transformations sont réalisés à tous les points de déversements durant les périodes représentatives de l’opération et les résultats sont documentés. Pour les groupes d’exploitations agricoles, les tests sont réalisés dans toutes les installations de transformation (collectives) gérées par le groupe et pour un échantillon représentatif des opérations de transformation membres comprenant les différents types de systèmes de traitements. Les eaux usées issues des opérations de transformation déversées dans les écosystèmes aquatiques sont conformes aux paramètres légaux de qualité des effluents. En l’absence de ces paramètres, elles se conforment aux paramètres des effluents. Les eaux usées provenant des opérations de transformation ne doivent pas être mélangées avec de l’eau propre afin de se conformer à ces paramètres.',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.6.2',
    description:
      "Les eaux usées humaines, les boues et les eaux d'égout ne sont pas utilisées dans la production ou le traitement. Les eaux d’égout traitées ne sont rejetées que dans les écosystèmes aquatiques. Pas applicable aux petites exploitations agricoles : Les eaux usées traitées doivent respecter les normes légales de qualité des eaux usées ou des paramètres équivalents si aucune norme légale n'existe.",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.6.3',
    description:
      "Les eaux usées provenant des opérations de transformation ne sont utilisées sur terre qu'après avoir été traitées pour éliminer les particules et les toxines. Les eaux usées traitées pour l'irrigation doivent respecter des paramètres spécifiques à la fois pour les eaux usées et l'irrigation.",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.7.1',
    description:
      "Les déchets sont gérés afin d'éviter les risques pour la santé et la sécurité. Ils sont stockés et éliminés uniquement dans des zones désignées, et non dans les écosystèmes naturels. Les déchets non organiques ne sont pas laissés sur le terrain.",
    groups: [
      'Petites exploitations agricoles',
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.7.2',
    description:
      'Les producteurs ne brûlent pas les déchets, sauf dans des incinérateurs conçus techniquement pour le type particulier de déchets.',
    groups: [
      'Petites exploitations agricoles',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.7.3',
    description:
      'Les producteurs séparent et recyclent les déchets suivant les options de gestion des déchets disponible, de recyclage et d’élimination. Les déchets organiques sont compostés, transformés pour une utilisation organique ou utilisés comme intrant pour d’autres raisons. Non applicable aux petites exploitations agricoles en groupe.',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
  {
    number: '6.8.1',
    description:
      'La direction consigne par écrit les types de sources d’énergie et l’énergie utilisée pour la production et la transformation des produits certifiés. Cette exigence s’applique à la direction du groupe uniquement si le groupe concerné utilise une source d’énergie pour les processus de transformation.',
    groups: [
      'Direction du groupe',
      'Grandes exploitations agricoles',
      'Petites/Grandes exploitations agricoles',
      'Systeme de gestion interne (SGI)',
    ],
  },
];

export async function seedRequirements(
  prisma: PrismaClient,
  sections: RequirementSection[],
  groups: RequirementGroup[],
): Promise<Requirement[]> {
  console.log('🌱 Seeding requirements...');

  const allRequirements: Requirement[] = [];
  for (const requirement of requirements) {
    const numberParts = requirement.number.split('.');
    const sectionNumber = numberParts.slice(0, -1).join('.');
    const created = await prisma.requirement.upsert({
      where: { number: requirement.number },
      update: {},
      create: {
        number: requirement.number,
        description: requirement.description ?? '',
        section: {
          connect: {
            id: sections.find((section) => section.number === sectionNumber).id,
          },
        },
        groups: {
          connect: requirement.groups.map((groupName) => {
            const group = groups.find((g) => g.name === groupName);
            if (!group) {
              throw new Error(`"${groupName}" not found`);
            }
            return { id: group.id };
          }),
        },
      },
    });
    allRequirements.push(created);
  }

  console.log('✅ Requirements requirements seeded:', allRequirements.length);
  return allRequirements;
}
