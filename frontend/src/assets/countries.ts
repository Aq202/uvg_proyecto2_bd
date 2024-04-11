const countries = [
  {
    name: 'Afganistán', code: 'AF', prefix: '+93', flag: '🇦🇫',
  },
  {
    name: 'Albania', code: 'AL', prefix: '+355', flag: '🇦🇱',
  },
  {
    name: 'Alemania', code: 'DE', prefix: '+49', flag: '🇩🇪',
  },
  {
    name: 'Andorra', code: 'AD', prefix: '+376', flag: '🇦🇩',
  },
  {
    name: 'Angola', code: 'AO', prefix: '+244', flag: '🇦🇴',
  },
  {
    name: 'Anguila', code: 'AI', prefix: '+1264', flag: '🇦🇮',
  },
  {
    name: 'Antigua y Barbuda', code: 'AG', prefix: '+1268', flag: '🇦🇬',
  },
  {
    name: 'Arabia Saudita', code: 'SA', prefix: '+966', flag: '🇸🇦',
  },
  {
    name: 'Argelia', code: 'DZ', prefix: '+213', flag: '🇩🇿',
  },
  {
    name: 'Argentina', code: 'AR', prefix: '+54', flag: '🇦🇷',
  },
  {
    name: 'Armenia', code: 'AM', prefix: '+374', flag: '🇦🇲',
  },
  {
    name: 'Aruba', code: 'AW', prefix: '+297', flag: '🇦🇼',
  },
  {
    name: 'Australia', code: 'AU', prefix: '+61', flag: '🇦🇺',
  },
  {
    name: 'Austria', code: 'AT', prefix: '+43', flag: '🇦🇹',
  },
  {
    name: 'Azerbaiyán', code: 'AZ', prefix: '+994', flag: '🇦🇿',
  },
  {
    name: 'Bahamas', code: 'BS', prefix: '+1242', flag: '🇧🇸',
  },
  {
    name: 'Bangladés', code: 'BD', prefix: '+880', flag: '🇧🇩',
  },
  {
    name: 'Barbados', code: 'BB', prefix: '+1246', flag: ' 🇧🇧',
  },
  {
    name: 'Baréin', code: 'BH', prefix: '+973', flag: '🇧🇭',
  },
  {
    name: 'Bélgica', code: 'BE', prefix: '+32', flag: '🇧🇪',
  },
  {
    name: 'Belice', code: 'BZ', prefix: '+501', flag: '🇧🇿',
  },
  {
    name: 'Benín', code: 'BJ', prefix: '+229', flag: '🇧🇯',
  },
  {
    name: 'Bermudas', code: 'BM', prefix: '+1441', flag: '🇧🇲',
  },
  {
    name: 'Bielorrusia', code: 'BY', prefix: '+375', flag: '🇧🇾',
  },
  {
    name: 'Bolivia', code: 'BO', prefix: '+591', flag: '🇧🇴',
  },
  {
    name: 'Bosnia y Herzegovina', code: 'BA', prefix: '+387', flag: '🇧🇦',
  },
  {
    name: 'Botsuana', code: 'BW', prefix: '+267', flag: '🇧🇼',
  },
  {
    name: 'Brasil', code: 'BR', prefix: '+55', flag: '🇧🇷',
  },
  {
    name: 'Brunéi', code: 'BN', prefix: '+673', flag: '🇧🇳',
  },
  {
    name: 'Bulgaria', code: 'BG', prefix: '+359', flag: '🇧🇬',
  },
  {
    name: 'Burkina Faso', code: 'BF', prefix: '+226', flag: '🇧🇫',
  },
  {
    name: 'Burundi', code: 'BI', prefix: '+257', flag: '🇧🇮',
  },
  {
    name: 'Bután', code: 'BT', prefix: '+975', flag: '🇧🇹',
  },
  {
    name: 'Cabo Verde', code: 'CV', prefix: '+238', flag: '🇨🇻',
  },
  {
    name: 'Camboya', code: 'KH', prefix: '+855', flag: '🇰🇭',
  },
  {
    name: 'Camerún', code: 'CM', prefix: '+237', flag: '🇨🇲',
  },
  {
    name: 'Canadá', code: 'CA', prefix: '+1', flag: '🇨🇦',
  },
  {
    name: 'Chad', code: 'TD', prefix: '+235', flag: '🇹🇩',
  },
  {
    name: 'Chile', code: 'CL', prefix: '+56', flag: '🇨🇱',
  },
  {
    name: 'China', code: 'CN', prefix: '+86', flag: '🇨🇳',
  },
  {
    name: 'Chipre', code: 'CY', prefix: '+357', flag: '🇨🇾',
  },
  {
    name: 'Ciudad del Vaticano', code: 'VA', prefix: '+39', flag: '🇻🇦',
  },
  {
    name: 'Colombia', code: 'CO', prefix: '+57', flag: '🇨🇴',
  },
  {
    name: 'Comoras', code: 'KM', prefix: '+269', flag: '🇰🇲',
  },
  {
    name: 'Congo', code: 'CG', prefix: '+242', flag: '🇨🇬',
  },
  {
    name: 'Corea del Norte', code: 'KP', prefix: '+850', flag: '🇰🇵',
  },
  {
    name: 'Corea del Sur', code: 'KR', prefix: '+82', flag: '🇰🇷',
  },
  {
    name: 'Costa de Marfil', code: 'CI', prefix: '+225', flag: '🇨🇮',
  },
  {
    name: 'Costa Rica', code: 'CR', prefix: '+506', flag: '🇨🇷',
  },
  {
    name: 'Croacia', code: 'HR', prefix: '+385', flag: '🇭🇷',
  },
  {
    name: 'Cuba', code: 'CU', prefix: '+53', flag: '🇨🇺',
  },
  {
    name: 'Curazao', code: 'CW', prefix: '+599', flag: '🇨🇼',
  },
  {
    name: 'Dinamarca', code: 'DK', prefix: '+45', flag: '🇩🇰',
  },
  {
    name: 'Dominica', code: 'DM', prefix: '+1767', flag: '🇩🇲',
  },
  {
    name: 'Ecuador', code: 'EC', prefix: '+593', flag: '🇪🇨',
  },
  {
    name: 'Egipto', code: 'EG', prefix: '+20', flag: '🇪🇬',
  },
  {
    name: 'El Salvador', code: 'SV', prefix: '+503', flag: '🇸🇻',
  },
  {
    name: 'Emiratos Árabes Unidos', code: 'AE', prefix: '+971', flag: '🇦🇪',
  },
  {
    name: 'Eritrea', code: 'ER', prefix: '+291', flag: '🇪🇷',
  },
  {
    name: 'Eslovaquia', code: 'SK', prefix: '+421', flag: '🇸🇰',
  },
  {
    name: 'Eslovenia', code: 'SI', prefix: '+386', flag: '🇸🇮',
  },
  {
    name: 'España', code: 'ES', prefix: '+34', flag: '🇪🇸',
  },
  {
    name: 'Estados Unidos', code: 'US', prefix: '+1', flag: '🇺🇸',
  },
  {
    name: 'Estonia', code: 'EE', prefix: '+372', flag: '🇪🇪',
  },
  {
    name: 'Eswatini', code: 'SZ', prefix: '+268', flag: '🇸🇿',
  },
  {
    name: 'Etiopía', code: 'ET', prefix: '+251', flag: '🇪🇹',
  },
  {
    name: 'Filipinas', code: 'PH', prefix: '+63', flag: '🇵🇭',
  },
  {
    name: 'Finlandia', code: 'FI', prefix: '+358', flag: '🇫🇮',
  },
  {
    name: 'Fiyi', code: 'FJ', prefix: '+679', flag: '🇫🇯',
  },
  {
    name: 'Francia', code: 'FR', prefix: '+33', flag: '🇫🇷',
  },
  {
    name: 'Gabón', code: 'GA', prefix: '+241', flag: '🇬🇦',
  },
  {
    name: 'Gambia', code: 'GM', prefix: '+220', flag: '🇬🇲',
  },
  {
    name: 'Georgia', code: 'GE', prefix: '+995', flag: '🇬🇪',
  },
  {
    name: 'Ghana', code: 'GH', prefix: '+233', flag: '🇬🇭',
  },
  {
    name: 'Gibraltar', code: 'GI', prefix: '+350', flag: '🇬🇮',
  },
  {
    name: 'Granada', code: 'GD', prefix: '+1473', flag: '🇬🇩',
  },
  {
    name: 'Grecia', code: 'GR', prefix: '+30', flag: '🇬🇷',
  },
  {
    name: 'Groenlandia', code: 'GL', prefix: '+299', flag: '🇬🇱',
  },
  {
    name: 'Guadalupe', code: 'GP', prefix: '+590', flag: '🇬🇵',
  },
  {
    name: 'Guam', code: 'GU', prefix: '+1671', flag: '🇬🇺',
  },
  {
    name: 'Guatemala', code: 'GT', prefix: '+502', flag: '🇬🇹',
  },
  {
    name: 'Guayana Francesa', code: 'GF', prefix: '+594', flag: '🇬🇫',
  },
  {
    name: 'Guernesey', code: 'GG', prefix: '+44', flag: '🇬🇬',
  },
  {
    name: 'Guinea', code: 'GN', prefix: '+224', flag: '🇬🇳',
  },
  {
    name: 'Guinea Ecuatorial', code: 'GQ', prefix: '+240', flag: '🇬🇶',
  },
  {
    name: 'Guinea-Bisáu', code: 'GW', prefix: '+245', flag: '🇬🇼',
  },
  {
    name: 'Guyana', code: 'GY', prefix: '+592', flag: '🇬🇾',
  },
  {
    name: 'Haití', code: 'HT', prefix: '+509', flag: '🇭🇹',
  },
  {
    name: 'Honduras', code: 'HN', prefix: '+504', flag: '🇭🇳',
  },
  {
    name: 'Hong Kong', code: 'HK', prefix: '+852', flag: '🇭🇰',
  },
  {
    name: 'Hungría', code: 'HU', prefix: '+36', flag: '🇭🇺',
  },
  {
    name: 'India', code: 'IN', prefix: '+91', flag: '🇮🇳',
  },
  {
    name: 'Indonesia', code: 'ID', prefix: '+62', flag: '🇮🇩',
  },
  {
    name: 'Irán', code: 'IR', prefix: '+98', flag: '🇮🇷',
  },
  {
    name: 'Iraq', code: 'IQ', prefix: '+964', flag: '🇮🇶',
  },
  {
    name: 'Irlanda', code: 'IE', prefix: '+353', flag: '🇮🇪',
  },
  {
    name: 'Isla Christmas', code: 'CX', prefix: '+61', flag: '🇨🇽',
  },
  {
    name: 'Isla de Man', code: 'IM', prefix: '+44', flag: '🇮🇲',
  },
  {
    name: 'Isla Norfolk', code: 'NF', prefix: '+672', flag: '🇳🇫',
  },
  {
    name: 'Islandia', code: 'IS', prefix: '+354', flag: '🇮🇸',
  },
  {
    name: 'Islas Caimán', code: 'KY', prefix: '+1345', flag: '🇰🇾',
  },
  {
    name: 'Islas Cocos', code: 'CC', prefix: '+61', flag: '🇨🇨',
  },
  {
    name: 'Islas Cook', code: 'CK', prefix: '+682', flag: '🇨🇰',
  },
  {
    name: 'Islas Feroe', code: 'FO', prefix: '+298', flag: '🇫🇴',
  },
  {
    name: 'Islas Malvinas', code: 'FK', prefix: '+500', flag: '🇫🇰',
  },
  {
    name: 'Islas Marianas del Norte', code: 'MP', prefix: '+1670', flag: '🇲🇵',
  },
  {
    name: 'Islas Marshall', code: 'MH', prefix: '+692', flag: '🇲🇭',
  },
  {
    name: 'Islas Salomón', code: 'SB', prefix: '+677', flag: '🇸🇧',
  },
  {
    name: 'Islas Turcas y Caicos', code: 'TC', prefix: '+1649', flag: '🇹🇨',
  },
  {
    name: 'Islas Vírgenes Británicas', code: 'VG', prefix: '+1284', flag: '🇻🇬',
  },
  {
    name: 'Islas Vírgenes de los Estados Unidos', code: 'VI', prefix: '+1340', flag: '🇻🇮',
  },
  {
    name: 'Israel', code: 'IL', prefix: '+972', flag: '🇮🇱',
  },
  {
    name: 'Italia', code: 'IT', prefix: '+39', flag: '🇮🇹',
  },
  {
    name: 'Jamaica', code: 'JM', prefix: '+1876', flag: '🇯🇲',
  },
  {
    name: 'Japón', code: 'JP', prefix: '+81', flag: '🇯🇵',
  },
  {
    name: 'Jersey', code: 'JE', prefix: '+44', flag: '🇯🇪',
  },
  {
    name: 'Jordania', code: 'JO', prefix: '+962', flag: '🇯🇴',
  },
  {
    name: 'Kazajistán', code: 'KZ', prefix: '+7', flag: '🇰🇿',
  },
  {
    name: 'Kenia', code: 'KE', prefix: '+254', flag: '🇰🇪',
  },
  {
    name: 'Kirguistán', code: 'KG', prefix: '+996', flag: '🇰🇬',
  },
  {
    name: 'Kiribati', code: 'KI', prefix: '+686', flag: '🇰🇮',
  },
  {
    name: 'Kuwait', code: 'KW', prefix: '+965', flag: '🇰🇼',
  },
  {
    name: 'Laos', code: 'LA', prefix: '+856', flag: '🇱🇦',
  },
  {
    name: 'Lesoto', code: 'LS', prefix: '+266', flag: '🇱🇸',
  },
  {
    name: 'Letonia', code: 'LV', prefix: '+371', flag: '🇱🇻',
  },
  {
    name: 'Líbano', code: 'LB', prefix: '+961', flag: '🇱🇧',
  },
  {
    name: 'Liberia', code: 'LR', prefix: '+231', flag: '🇱🇷',
  },
  {
    name: 'Libia', code: 'LY', prefix: '+218', flag: '🇱🇾',
  },
  {
    name: 'Liechtenstein', code: 'LI', prefix: '+423', flag: '🇱🇮',
  },
  {
    name: 'Lituania', code: 'LT', prefix: '+370', flag: '🇱🇹',
  },
  {
    name: 'Luxemburgo', code: 'LU', prefix: '+352', flag: '🇱🇺',
  },
  {
    name: 'Macao', code: 'MO', prefix: '+853', flag: '🇲🇴',
  },
  {
    name: 'Macedonia del Norte', code: 'MK', prefix: '+389', flag: '🇲🇰',
  },
  {
    name: 'Madagascar', code: 'MG', prefix: '+261', flag: '🇲🇬',
  },
  {
    name: 'Malasia', code: 'MY', prefix: '+60', flag: '🇲🇾',
  },
  {
    name: 'Malaui', code: 'MW', prefix: '+265', flag: '🇲🇼',
  },
  {
    name: 'Maldivas', code: 'MV', prefix: '+960', flag: '🇲🇻',
  },
  {
    name: 'Malí', code: 'ML', prefix: '+223', flag: '🇲🇱',
  },
  {
    name: 'Malta', code: 'MT', prefix: '+356', flag: '🇲🇹',
  },
  {
    name: 'Marruecos', code: 'MA', prefix: '+212', flag: '🇲🇦',
  },
  {
    name: 'Martinica', code: 'MQ', prefix: '+596', flag: '🇲🇶',
  },
  {
    name: 'Mauricio', code: 'MU', prefix: '+230', flag: '🇲🇺',
  },
  {
    name: 'Mauritania', code: 'MR', prefix: '+222', flag: '🇲🇷',
  },
  {
    name: 'Mayotte', code: 'YT', prefix: '+262', flag: '🇾🇹',
  },
  {
    name: 'México', code: 'MX', prefix: '+52', flag: '🇲🇽',
  },
  {
    name: 'Micronesia', code: 'FM', prefix: '+691', flag: '🇫🇲',
  },
  {
    name: 'Moldavia', code: 'MD', prefix: '+373', flag: '🇲🇩',
  },
  {
    name: 'Mónaco', code: 'MC', prefix: '+377', flag: '🇲🇨',
  },
  {
    name: 'Mongolia', code: 'MN', prefix: '+976', flag: '🇲🇳',
  },
  {
    name: 'Montenegro', code: 'ME', prefix: '+382', flag: '🇲🇪',
  },
  {
    name: 'Montserrat', code: 'MS', prefix: '+1664', flag: '🇲🇸',
  },
  {
    name: 'Mozambique', code: 'MZ', prefix: '+258', flag: '🇲🇿',
  },
  {
    name: 'Myanmar', code: 'MM', prefix: '+95', flag: '🇲🇲',
  },
  {
    name: 'Namibia', code: 'NA', prefix: '+264', flag: '🇳🇦',
  },
  {
    name: 'Nauru', code: 'NR', prefix: '+674', flag: '🇳🇷',
  },
  {
    name: 'Nepal', code: 'NP', prefix: '+977', flag: '🇳🇵',
  },
  {
    name: 'Nicaragua', code: 'NI', prefix: '+505', flag: '🇳🇮',
  },
  {
    name: 'Níger', code: 'NE', prefix: '+227', flag: '🇳🇪',
  },
  {
    name: 'Nigeria', code: 'NG', prefix: '+234', flag: '🇳🇬',
  },
  {
    name: 'Niue', code: 'NU', prefix: '+683', flag: '🇳🇺',
  },
  {
    name: 'Noruega', code: 'NO', prefix: '+47', flag: '🇳🇴',
  },
  {
    name: 'Nueva Caledonia', code: 'NC', prefix: '+687', flag: '🇳🇨',
  },
  {
    name: 'Nueva Zelanda', code: 'NZ', prefix: '+64', flag: '🇳🇿',
  },
  {
    name: 'Omán', code: 'OM', prefix: '+968', flag: '🇴🇲',
  },
  {
    name: 'Países Bajos', code: 'NL', prefix: '+31', flag: '🇳🇱',
  },
  {
    name: 'Pakistán', code: 'PK', prefix: '+92', flag: '🇵🇰',
  },
  {
    name: 'Palaos', code: 'PW', prefix: '+680', flag: '🇵🇼',
  },
  {
    name: 'Palestina', code: 'PS', prefix: '+970', flag: '🇵🇸',
  },
  {
    name: 'Panamá', code: 'PA', prefix: '+507', flag: '🇵🇦',
  },
  {
    name: 'Papúa Nueva Guinea', code: 'PG', prefix: '+675', flag: '🇵🇬',
  },
  {
    name: 'Paraguay', code: 'PY', prefix: '+595', flag: '🇵🇾',
  },
  {
    name: 'Perú', code: 'PE', prefix: '+51', flag: '🇵🇪',
  },
  {
    name: 'Pitcairn', code: 'PN', prefix: '+64', flag: '🇵🇳',
  },
  {
    name: 'Polinesia Francesa', code: 'PF', prefix: '+689', flag: '🇵🇫',
  },
  {
    name: 'Polonia', code: 'PL', prefix: '+48', flag: '🇵🇱',
  },
  {
    name: 'Portugal', code: 'PT', prefix: '+351', flag: '🇵🇹',
  },
  {
    name: 'Puerto Rico', code: 'PR', prefix: '+1', flag: '🇵🇷',
  },
  {
    name: 'Qatar', code: 'QA', prefix: '+974', flag: '🇶🇦',
  },
  {
    name: 'Reino Unido', code: 'GB', prefix: '+44', flag: '🇬🇧',
  },
  {
    name: 'República Centroafricana', code: 'CF', prefix: '+236', flag: '🇨🇫',
  },
  {
    name: 'República Checa', code: 'CZ', prefix: '+420', flag: '🇨🇿',
  },
  {
    name: 'República Democrática del Congo', code: 'CD', prefix: '+243', flag: '🇨🇩',
  },
  {
    name: 'República Dominicana', code: 'DO', prefix: '+1', flag: '🇩🇴',
  },
  {
    name: 'Reunión', code: 'RE', prefix: '+262', flag: '🇷🇪',
  },
  {
    name: 'Ruanda', code: 'RW', prefix: '+250', flag: '🇷🇼',
  },
  {
    name: 'Rumania', code: 'RO', prefix: '+40', flag: '🇷🇴',
  },
  {
    name: 'Rusia', code: 'RU', prefix: '+7', flag: '🇷🇺',
  },
  {
    name: 'Sahara Occidental', code: 'EH', prefix: '+212', flag: '🇪🇭',
  },
  {
    name: 'Samoa', code: 'WS', prefix: '+685', flag: '🇼🇸',
  },
  {
    name: 'Samoa Americana', code: 'AS', prefix: '+1684', flag: '🇦🇸',
  },
  {
    name: 'San Cristóbal y Nieves', code: 'KN', prefix: '+1869', flag: '🇰🇳',
  },
  {
    name: 'San Marino', code: 'SM', prefix: '+378', flag: '🇸🇲',
  },
  {
    name: 'San Martín (parte neerlandesa)', code: 'MF', prefix: '+590', flag: '🇲🇫',
  },
  {
    name: 'San Pedro y Miquelón', code: 'PM', prefix: '+508', flag: '🇵🇲',
  },
  {
    name: 'San Vicente y las Granadinas', code: 'VC', prefix: '+1784', flag: '🇻🇨',
  },
  {
    name: 'Santa Elena, Ascensión y Tristán de Acuña', code: 'SH', prefix: '+290', flag: '🇸🇭',
  },
  {
    name: 'Santa Lucía', code: 'LC', prefix: '+1758', flag: '🇱🇨',
  },
  {
    name: 'Santo Tomé y Príncipe', code: 'ST', prefix: '+239', flag: '🇸🇹',
  },
  {
    name: 'Senegal', code: 'SN', prefix: '+221', flag: '🇸🇳',
  },
  {
    name: 'Serbia', code: 'RS', prefix: '+381', flag: '🇷🇸',
  },
  {
    name: 'Seychelles', code: 'SC', prefix: '+248', flag: '🇸🇨',
  },
  {
    name: 'Sierra Leona', code: 'SL', prefix: '+232', flag: '🇸🇱',
  },
  {
    name: 'Singapur', code: 'SG', prefix: '+65', flag: '🇸🇬',
  },
  {
    name: 'Siria', code: 'SY', prefix: '+963', flag: '🇸🇾',
  },
  {
    name: 'Somalia', code: 'SO', prefix: '+252', flag: '🇸🇴',
  },
  {
    name: 'Sri Lanka', code: 'LK', prefix: '+94', flag: '🇱🇰',
  },
  {
    name: 'Sudáfrica', code: 'ZA', prefix: '+27', flag: '🇿🇦',
  },
  {
    name: 'Sudán', code: 'SD', prefix: '+249', flag: '🇸🇩',
  },
  {
    name: 'Sudán del Sur', code: 'SS', prefix: '+211', flag: '🇸🇸',
  },
  {
    name: 'Suecia', code: 'SE', prefix: '+46', flag: '🇸🇪',
  },
  {
    name: 'Suiza', code: 'CH', prefix: '+41', flag: '🇨🇭',
  },
  {
    name: 'Surinam', code: 'SR', prefix: '+597', flag: '🇸🇷',
  },
  {
    name: 'Svalbard y Jan Mayen', code: 'SJ', prefix: '+47', flag: '🇸🇯',
  },
  {
    name: 'Tailandia', code: 'TH', prefix: '+66', flag: '🇹🇭',
  },
  {
    name: 'Taiwán', code: 'TW', prefix: '+886', flag: '🇹🇼',
  },
  {
    name: 'Tanzania', code: 'TZ', prefix: '+255', flag: '🇹🇿',
  },
  {
    name: 'Tayikistán', code: 'TJ', prefix: '+992', flag: '🇹🇯',
  },
  {
    name: 'Territorio Británico del Océano Índico', code: 'IO', prefix: '+246', flag: '🇮🇴',
  },
  {
    name: 'Timor-Leste', code: 'TL', prefix: '+670', flag: '🇹🇱',
  },
  {
    name: 'Togo', code: 'TG', prefix: '+228', flag: '🇹🇬',
  },
  {
    name: 'Tokelau', code: 'TK', prefix: '+690', flag: '🇹🇰',
  },
  {
    name: 'Tonga', code: 'TO', prefix: '+676', flag: '🇹🇴',
  },
  {
    name: 'Trinidad y Tobago', code: 'TT', prefix: '+1868', flag: '🇹🇹',
  },
  {
    name: 'Túnez', code: 'TN', prefix: '+216', flag: '🇹🇳',
  },
  {
    name: 'Turkmenistán', code: 'TM', prefix: '+993', flag: '🇹🇲',
  },
  {
    name: 'Turquía', code: 'TR', prefix: '+90', flag: '🇹🇷',
  },
  {
    name: 'Tuvalu', code: 'TV', prefix: '+688', flag: '🇹🇻',
  },
  {
    name: 'Ucrania', code: 'UA', prefix: '+380', flag: '🇺🇦',
  },
  {
    name: 'Uganda', code: 'UG', prefix: '+256', flag: '🇺🇬',
  },
  {
    name: 'Uruguay', code: 'UY', prefix: '+598', flag: '🇺🇾',
  },
  {
    name: 'Uzbekistán', code: 'UZ', prefix: '+998', flag: '🇺🇿',
  },
  {
    name: 'Vanuatu', code: 'VU', prefix: '+678', flag: '🇻🇺',
  },
  {
    name: 'Venezuela', code: 'VE', prefix: '+58', flag: '🇻🇪',
  },
  {
    name: 'Vietnam', code: 'VN', prefix: '+84', flag: '🇻🇳',
  },
  {
    name: 'Wallis y Futuna', code: 'WF', prefix: '+681', flag: '🇼🇫',
  },
  {
    name: 'Yemen', code: 'YE', prefix: '+967', flag: '🇾🇪',
  },
  {
    name: 'Yibuti', code: 'DJ', prefix: '+253', flag: '🇩🇯',
  },
  {
    name: 'Zambia', code: 'ZM', prefix: '+260', flag: '🇿🇲',
  },
  {
    name: 'Zimbabue', code: 'ZW', prefix: '+263', flag: '🇿🇼',
  },
];

export default countries;
