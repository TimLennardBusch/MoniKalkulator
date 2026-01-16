import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  behandlung: string;
  produkt: string;
  typ: string;
  laenge: string;
  artikelId: string;
  preis: number;
  info: string;
}

// Initial products from CSV (behandlung is always "Einsetzen" for product-based calculations)
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '3.5 OM', laenge: '40 cm', artikelId: '18602160', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '2', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '3', laenge: '40 cm', artikelId: '18602159', preis: 50, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '3', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '1', laenge: '40 cm', artikelId: '18602153', preis: 50, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '4', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '10AA', laenge: '40 cm', artikelId: '18602155', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '5', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '10AA OM', laenge: '40 cm', artikelId: '18602156', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '6', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '8AA', laenge: '40 cm', artikelId: '18602166', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '7', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '10S', laenge: '55 cm', artikelId: '18602218', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '8', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '10A', laenge: '55 cm', artikelId: '18602214', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '9', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: 'L10', laenge: '55 cm', artikelId: '18602231', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '10', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '10G', laenge: '55 cm', artikelId: '18602217', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '11', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '9G.10 OM', laenge: '55 cm', artikelId: '18602230', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '12', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '9G', laenge: '55 cm', artikelId: '18602229', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '13', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '9.8G', laenge: '55 cm', artikelId: '18602227', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '14', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '9A', laenge: '55 cm', artikelId: '18602228', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '15', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: 'L8', laenge: '55 cm', artikelId: '18602234', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '16', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '8A', laenge: '55 cm', artikelId: '18602224', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '17', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '8A.9A', laenge: '55 cm', artikelId: '18602225', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '18', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '7G.8G OM', laenge: '55 cm', artikelId: '18602223', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '19', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '6G.8G', laenge: '55 cm', artikelId: '18602222', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '20', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '5RM', laenge: '55 cm', artikelId: '18602221', preis: 82, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '21', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: 'L6', laenge: '55 cm', artikelId: '18602233', preis: 82, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '22', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: 'L5', laenge: '55 cm', artikelId: '18602232', preis: 82, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '23', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '3.5 OM', laenge: '55 cm', artikelId: '18602220', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '24', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '3', laenge: '55 cm', artikelId: '18602219', preis: 82, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '25', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '1', laenge: '55 cm', artikelId: '18602213', preis: 82, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '26', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '10AA', laenge: '55 cm', artikelId: '18602215', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '27', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '10AA OM', laenge: '55 cm', artikelId: '18602216', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '28', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '8AA', laenge: '55 cm', artikelId: '18602226', preis: 92, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '29', behandlung: 'Einsetzen', produkt: 'Easy Length', typ: '10A', laenge: '55 cm', artikelId: '18601765', preis: 195, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '30', behandlung: 'Einsetzen', produkt: 'Easy Length', typ: 'L10', laenge: '55 cm', artikelId: '18601764', preis: 195, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '31', behandlung: 'Einsetzen', produkt: 'Easy Length', typ: '10G', laenge: '55 cm', artikelId: '18601014', preis: 195, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '32', behandlung: 'Einsetzen', produkt: 'Easy Length', typ: '9G', laenge: '55 cm', artikelId: '18601011', preis: 195, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '33', behandlung: 'Einsetzen', produkt: 'Easy Length', typ: '9.8G', laenge: '55 cm', artikelId: '18601015', preis: 195, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '34', behandlung: 'Einsetzen', produkt: 'Easy Length', typ: 'L8', laenge: '55 cm', artikelId: '18601762', preis: 195, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '35', behandlung: 'Einsetzen', produkt: 'Easy Length', typ: '8A', laenge: '55 cm', artikelId: '18601016', preis: 195, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '36', behandlung: 'Einsetzen', produkt: 'Easy Length', typ: '8A.9A', laenge: '55 cm', artikelId: '18601012', preis: 195, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '37', behandlung: 'Einsetzen', produkt: 'Easy Length', typ: '6G.8G', laenge: '55 cm', artikelId: '18601013', preis: 195, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '38', behandlung: 'Einsetzen', produkt: 'Easy Length', typ: 'L5', laenge: '55 cm', artikelId: '18601759', preis: 185, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '39', behandlung: 'Einsetzen', produkt: 'Easy Length', typ: '3', laenge: '55 cm', artikelId: '18601756', preis: 185, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '40', behandlung: 'Einsetzen', produkt: 'Easy Length', typ: '1', laenge: '55 cm', artikelId: '18601754', preis: 185, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '41', behandlung: 'Einsetzen', produkt: 'Easy Volume', typ: '10A', laenge: '40 cm', artikelId: '18601742', preis: 120, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '42', behandlung: 'Einsetzen', produkt: 'Easy Volume', typ: 'L10', laenge: '40 cm', artikelId: '18601743', preis: 120, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '43', behandlung: 'Einsetzen', produkt: 'Easy Volume', typ: '10G', laenge: '40 cm', artikelId: '18602008', preis: 120, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '44', behandlung: 'Einsetzen', produkt: 'Easy Volume', typ: '9G', laenge: '40 cm', artikelId: '18602005', preis: 120, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '45', behandlung: 'Einsetzen', produkt: 'Easy Volume', typ: '9.8G', laenge: '40 cm', artikelId: '18602009', preis: 120, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '46', behandlung: 'Einsetzen', produkt: 'Easy Volume', typ: 'L8', laenge: '40 cm', artikelId: '18601745', preis: 120, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '47', behandlung: 'Einsetzen', produkt: 'Easy Volume', typ: '8A', laenge: '40 cm', artikelId: '18602010', preis: 120, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '48', behandlung: 'Einsetzen', produkt: 'Easy Volume', typ: '8A.9A', laenge: '40 cm', artikelId: '18602006', preis: 120, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '49', behandlung: 'Einsetzen', produkt: 'Easy Volume', typ: '6G.8G', laenge: '40 cm', artikelId: '18602007', preis: 120, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '50', behandlung: 'Einsetzen', produkt: 'Easy Volume', typ: 'L5', laenge: '40 cm', artikelId: '18601748', preis: 116, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '51', behandlung: 'Einsetzen', produkt: 'Easy Volume', typ: '3', laenge: '40 cm', artikelId: '18601751', preis: 116, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '52', behandlung: 'Einsetzen', produkt: 'Easy Volume', typ: '1', laenge: '40 cm', artikelId: '18601753', preis: 116, info: '2,8 cm breit / Inhalt: 10 Stk.' },
  { id: '53', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '10A', laenge: '25 cm', artikelId: '18601985', preis: 19, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '54', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: 'L10', laenge: '25 cm', artikelId: '18601802', preis: 19, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '55', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '10G', laenge: '25 cm', artikelId: '18601986', preis: 19, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '56', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '9G', laenge: '25 cm', artikelId: '18601987', preis: 19, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '57', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '9.8G', laenge: '25 cm', artikelId: '18601992', preis: 19, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '58', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: 'L8', laenge: '25 cm', artikelId: '18601804', preis: 19, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '59', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '8A', laenge: '25 cm', artikelId: '18601993', preis: 19, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '60', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '8A.9A', laenge: '25 cm', artikelId: '18601988', preis: 19, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '61', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '6G.8G', laenge: '25 cm', artikelId: '18601989', preis: 19, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '62', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: 'L5', laenge: '25 cm', artikelId: '18601990', preis: 19, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '63', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '3', laenge: '25 cm', artikelId: '18601808', preis: 18, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '64', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '1', laenge: '25 cm', artikelId: '18601810', preis: 18, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '65', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '10S', laenge: '40 cm', artikelId: '18601071', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '66', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '10A', laenge: '40 cm', artikelId: '18601072', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '67', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: 'L10', laenge: '40 cm', artikelId: '18601780', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '68', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '10G', laenge: '40 cm', artikelId: '18601995', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '69', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '9G.10 OM', laenge: '40 cm', artikelId: '18601782', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '70', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '9G', laenge: '40 cm', artikelId: '18601996', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '71', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '9.8G', laenge: '40 cm', artikelId: '18601998', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '72', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '9A', laenge: '40 cm', artikelId: '18601999', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '73', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: 'L8', laenge: '40 cm', artikelId: '18601783', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '74', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '8A', laenge: '40 cm', artikelId: '18602000', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '75', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '8A.9A', laenge: '40 cm', artikelId: '18601073', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '76', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '7G.8G OM', laenge: '40 cm', artikelId: '18602001', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '77', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '6G.8G', laenge: '40 cm', artikelId: '18601788', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '78', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '5RM', laenge: '40 cm', artikelId: '18601790', preis: 30, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '79', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: 'L6', laenge: '40 cm', artikelId: '18601785', preis: 30, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '80', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: 'L5', laenge: '40 cm', artikelId: '18601786', preis: 30, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '81', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '3.5 OM', laenge: '40 cm', artikelId: '18602002', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '82', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '3', laenge: '40 cm', artikelId: '18601792', preis: 30, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '83', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '1', laenge: '40 cm', artikelId: '18601795', preis: 30, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '84', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '10AA', laenge: '40 cm', artikelId: '18602109', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '85', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '10AA OM', laenge: '40 cm', artikelId: '18602110', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '86', behandlung: 'Einsetzen', produkt: 'Tape Extensions', typ: '8AA', laenge: '40 cm', artikelId: '18602141', preis: 32, info: '7 cm breit / Inhalt: 1 Stk.' },
  { id: '87', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '10S', laenge: '40 cm', artikelId: '18601953', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '88', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '10A', laenge: '40 cm', artikelId: '18601954', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '89', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: 'L10', laenge: '40 cm', artikelId: '18601955', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '90', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '10G', laenge: '40 cm', artikelId: '18601956', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '91', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '9G.10 OM', laenge: '40 cm', artikelId: '18601957', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '92', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '9G', laenge: '40 cm', artikelId: '18601958', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '93', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '9.8G', laenge: '40 cm', artikelId: '18601959', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '94', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '9A', laenge: '40 cm', artikelId: '18601960', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '95', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: 'L8', laenge: '40 cm', artikelId: '18601961', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '96', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '8A', laenge: '40 cm', artikelId: '18601962', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '97', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '8A.9A', laenge: '40 cm', artikelId: '18601963', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '98', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '7G.8G OM', laenge: '40 cm', artikelId: '18601964', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '99', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '6G.8G', laenge: '40 cm', artikelId: '18601965', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '100', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '5RM', laenge: '40 cm', artikelId: '18601966', preis: 125, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '101', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: 'L6', laenge: '40 cm', artikelId: '18601967', preis: 125, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '102', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: 'L5', laenge: '40 cm', artikelId: '18601968', preis: 125, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '103', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '3.5 OM', laenge: '40 cm', artikelId: '18601969', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '104', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '3', laenge: '40 cm', artikelId: '18601970', preis: 125, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '105', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '1', laenge: '40 cm', artikelId: '18601971', preis: 125, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '106', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '10AA', laenge: '40 cm', artikelId: '18602115', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '107', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '10AA OM', laenge: '40 cm', artikelId: '18602116', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '108', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '8AA', laenge: '40 cm', artikelId: '18602139', preis: 135, info: '8 cm breit / Inhalt: 3 Stk.' },
  { id: '109', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '10A', laenge: '55 cm', artikelId: '18601972', preis: 99, info: '8 cm breit / Inhalt: 1 Stk.' },
  { id: '110', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: 'L10', laenge: '55 cm', artikelId: '18601973', preis: 99, info: '8 cm breit / Inhalt: 1 Stk.' },
  { id: '111', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '10G', laenge: '55 cm', artikelId: '18601974', preis: 99, info: '8 cm breit / Inhalt: 1 Stk.' },
  { id: '112', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '9G', laenge: '55 cm', artikelId: '18601975', preis: 99, info: '8 cm breit / Inhalt: 1 Stk.' },
  { id: '113', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '9.8G', laenge: '55 cm', artikelId: '18601976', preis: 99, info: '8 cm breit / Inhalt: 1 Stk.' },
  { id: '114', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: 'L8', laenge: '55 cm', artikelId: '18601977', preis: 99, info: '8 cm breit / Inhalt: 1 Stk.' },
  { id: '115', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '8A', laenge: '55 cm', artikelId: '18601978', preis: 99, info: '8 cm breit / Inhalt: 1 Stk.' },
  { id: '116', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '8A.9A', laenge: '55 cm', artikelId: '18601979', preis: 99, info: '8 cm breit / Inhalt: 1 Stk.' },
  { id: '117', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '6G.8G', laenge: '55 cm', artikelId: '18601980', preis: 99, info: '8 cm breit / Inhalt: 1 Stk.' },
  { id: '118', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: 'L5', laenge: '55 cm', artikelId: '18601981', preis: 89, info: '8 cm breit / Inhalt: 1 Stk.' },
  { id: '119', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '3', laenge: '55 cm', artikelId: '18601982', preis: 89, info: '8 cm breit / Inhalt: 1 Stk.' },
  { id: '120', behandlung: 'Einsetzen', produkt: 'Doublehair', typ: '1', laenge: '55 cm', artikelId: '18601983', preis: 89, info: '8 cm breit / Inhalt: 1 Stk.' },
  { id: '121', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '10S', laenge: '40 cm', artikelId: '18602158', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '122', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '10A', laenge: '40 cm', artikelId: '18602154', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '123', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: 'L10', laenge: '40 cm', artikelId: '18602171', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '124', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '10G', laenge: '40 cm', artikelId: '18602157', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '125', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '9G.10 OM', laenge: '40 cm', artikelId: '18602170', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '126', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '9G', laenge: '40 cm', artikelId: '18602169', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '127', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '9.8G', laenge: '40 cm', artikelId: '18602167', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '128', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '9A', laenge: '40 cm', artikelId: '18602168', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '129', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: 'L8', laenge: '40 cm', artikelId: '18602174', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '130', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '8A', laenge: '40 cm', artikelId: '18602164', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '131', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '8A.9A', laenge: '40 cm', artikelId: '18602165', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '132', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '7G.8G OM', laenge: '40 cm', artikelId: '18602163', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '133', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '6G.8G', laenge: '40 cm', artikelId: '18602162', preis: 52.5, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '134', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: '5RM', laenge: '40 cm', artikelId: '18602161', preis: 50, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '135', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: 'L6', laenge: '40 cm', artikelId: '18602173', preis: 50, info: '4 cm breit / Inhalt: 3 Stk.' },
  { id: '136', behandlung: 'Einsetzen', produkt: 'Easy Invisible', typ: 'L5', laenge: '40 cm', artikelId: '18602172', preis: 50, info: '4 cm breit / Inhalt: 3 Stk.' },
];

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  importProducts: (products: Product[]) => void;
  getUniqueValues: (field: keyof Product) => string[];
  getFilteredOptions: (
    field: 'behandlung' | 'produkt' | 'typ' | 'laenge',
    currentSelection: Record<string, string>
  ) => { available: string[]; unavailable: string[] };
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),

      updateProduct: (id, data) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      importProducts: (newProducts) =>
        set((state) => ({ products: [...state.products, ...newProducts] })),

      getUniqueValues: (field) => {
        const values = get().products.map((p) => String(p[field]));
        return [...new Set(values)].filter(Boolean);
      },

      getFilteredOptions: (field, currentSelection) => {
        const products = get().products;
        const allValues = [...new Set(products.map((p) => p[field]))].filter(Boolean);

        const matchingProducts = products.filter((p) => {
          if (currentSelection.behandlung && p.behandlung !== currentSelection.behandlung) return false;
          if (currentSelection.produkt && p.produkt !== currentSelection.produkt) return false;
          if (currentSelection.typ && p.typ !== currentSelection.typ) return false;
          if (currentSelection.laenge && p.laenge !== currentSelection.laenge) return false;
          return true;
        });

        const availableValues = [...new Set(matchingProducts.map((p) => p[field]))].filter(Boolean);
        const unavailableValues = allValues.filter((v) => !availableValues.includes(v));

        return {
          available: availableValues.sort((a, b) => a.localeCompare(b, 'de')),
          unavailable: unavailableValues.sort((a, b) => a.localeCompare(b, 'de')),
        };
      },
    }),
    {
      name: 'moni-products',
      merge: (persistedState, currentState) => {
        const persisted = persistedState as ProductState;
        // If no products in localStorage, use initial data
        if (!persisted || !persisted.products || persisted.products.length === 0) {
          return { ...currentState, products: INITIAL_PRODUCTS };
        }
        return { ...currentState, ...persisted };
      },
    }
  )
);
