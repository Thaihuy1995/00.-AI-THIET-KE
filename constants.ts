import { PresetPrompt, Resolution } from "./types";

export const PRESET_PROMPTS: PresetPrompt[] = [
  { id: 1, name: "Mẫu 1 - Dinh thự sân vườn", content: "Ảnh kiến trúc ngoại thất siêu thực tế, chất lượng 8K. Bối cảnh là sân trước của một khu dinh thự sang trọng vào ban ngày. Sân được lát gạch đỏ rustic. Bên trái có một chiếc xe SUV cổ màu be đang đậu. Hàng rào cây xanh (hedge) thấp được cắt tỉa vuông vức, tỉ mỉ chạy dọc theo chân tường. Cây cổ thụ lớn với tán lá xanh mướt, rất chi tiết ở góc trên bên phải và phía sau, tạo bóng nắng tự nhiên xuống sân. Hai bên là một phần tường của các tòa nhà phụ kiến trúc cổ điển màu kem. Ánh nắng mặt trời tự nhiên rực rỡ, bầu trời xanh trong vắt không gợn mây. Không khí trong lành, cao cấp." },
  { id: 2, name: "Mẫu 2 - Giao lộ đêm", content: "Ảnh kiến trúc đường phố siêu thực vào thời điểm chập choạng tối (Blue hour chuyển sang đêm). Bối cảnh là một ngã tư giao lộ sầm uất điển hình tại thành phố Việt Nam. Bầu trời đêm màu xanh thẫm sâu thẳm. Ánh sáng đèn đường cao áp màu vàng ấm chiếu rọi xuống mặt đường nhựa bóng loáng, phản chiếu ánh đèn đô thị. Giao thông đông đúc với dòng xe máy và ô tô di chuyển liên tục, tạo ra các vệt sáng dài (long exposure light trails) màu đỏ của đèn hậu và trắng của đèn pha kéo dài trên đường. Các dãy nhà phố ống lân cận đã lên đèn rực rỡ. Không khí đô thị ồn ào, náo nhiệt và đầy năng lượng." },
  { id: 3, name: "Mẫu 3 - Sau mưa", content: "Ảnh kiến trúc ngoại thất siêu thực, độ phân giải 8K sắc nét. Một căn nhà phố hiện đại phong cách Việt Nam nổi bật. Bối cảnh đặc trưng sau cơn mưa rào: trời vừa hửng nắng gắt trở lại, bầu trời xanh thẫm được rửa sạch bụi, ánh sáng trong veo và rực rỡ. Độ tương phản cao, bóng đổ của cây cối và tòa nhà in sắc nét xuống nền đất. Mặt đường nhựa đen và vỉa hè lát gạch ướt sũng, loang loáng nước, xuất hiện những vũng nước đọng phản chiếu lung linh (reflection) hình ảnh cây xanh và các ngôi nhà lân cận. Cây cối ven đường xanh mướt, tươi mới. Không khí sạch sẽ, ướt át và chân thực." },
  { id: 4, name: "Mẫu 4 - Vườn nhiệt đới (Hoàng hôn)", content: "Ảnh ngoại thất siêu thực vào giờ vàng (hoàng hôn). Bối cảnh là một khu vườn nhiệt đới rậm rạp bao quanh. Bầu trời có dải màu chuyển từ cam rực rỡ, hồng phấn sang xanh nhạt ở phía trên. Ánh sáng mặt trời lặn ấm áp, chiếu ngược (backlit) từ phía sau hàng cây, tạo hiệu ứng viền sáng lên các tán lá. Thảm thực vật phong phú gồm nhiều cây dừa cao, bụi chuối, và các hàng rào cây bụi thấp với hoa màu đỏ hồng tươi tắn ở tiền cảnh. Đường đi lát bê tông ở góc nhìn thấp phía trước. Không khí ấm áp, ẩm ướt và yên bình của vùng nhiệt đới." },
  { id: 5, name: "Mẫu 5 - Đô thị ban ngày", content: "Ảnh chụp thực tế đường phố đô thị Việt Nam vào ban ngày, siêu thực, chất lượng 8K. Bối cảnh là một khu đất trống nằm giữa hai tòa nhà trên một con phố sầm uất. Bên trái là một ngôi nhà thấp tầng mái ngói đỏ truyền thống với mái hiên. Bên phải là một nhà ống hiện đại cao tầng, đặc trưng với các ban công tràn ngập cây xanh và quán cafe ở tầng trệt. Ánh nắng mặt trời ban ngày rực rỡ, chiếu sáng rõ nét, bầu trời xanh nhạt hơi mù. Mặt đường nhựa và vỉa hè bê tông ở tiền cảnh có người dân chạy xe máy và sinh hoạt bình thường. Không khí đô thị chân thực, sống động và chi tiết." },
  { id: 6, name: "Mẫu 6 - Đô thị Blue Hour", content: "Ảnh chụp thực tế đường phố đô thị Việt Nam vào thời điểm chập choạng tối (giờ xanh/blue hour), siêu thực, chất lượng 8K. Bối cảnh là một lô đất trống giữa khu dân cư đông đúc. Bầu trời chuyển màu xanh thẫm sâu lắng. Điểm nhấn là ánh sáng đèn vàng ấm áp, rực rỡ chiếu ra từ bên trong các cửa hàng ở tầng trệt và các tầng trên của tòa nhà ống bên phải, cũng như ngôi nhà thấp mái ngói bên trái. Sự tương phản mạnh mẽ giữa ánh sáng ấm trong nhà và ánh sáng lạnh ngoài trời. Đường nhựa và vỉa hè phía trước có xe máy di chuyển tạo vệt mờ nhẹ. Không khí sinh hoạt buổi tối chân thực, ấm cúng." },
  { id: 7, name: "Mẫu 7 - Khu quy hoạch mới (Nắng)", content: "Ảnh chụp thực tế ngoại thất siêu thực vào ban ngày, chất lượng 8K. Bối cảnh là một lô đất trống nằm trong một khu quy hoạch đô thị mới, rất thoáng đãng. Tiền cảnh là mặt đường nhựa xám và vỉa hè lát gạch bê tông sáng màu, sạch sẽ. Hai bên vị trí trung tâm được định hình bởi hai cây xanh trẻ đang phát triển, có cọc chống gỗ bảo vệ. Hậu cảnh là một bãi cỏ xanh rộng lớn trải dài phía sau, tiếp giáp với đường chân trời là các dãy nhà chung cư và đô thị mới màu trắng ở xa dưới bầu trời xanh trong vắt, không gợn mây. Ánh nắng mặt trời rực rỡ, gay gắt, tạo bóng đổ sắc nét trên vỉa hè." },
  { id: 8, name: "Mẫu 8 - Khu quy hoạch mới (Âm u)", content: "Ảnh chụp thực tế ngoại thất siêu thực, chất lượng 8K. Bối cảnh là một lô đất trống nằm trên mặt đường nội bộ của một khu quy hoạch dân cư mới. Thời tiết ban ngày trời âm u, bầu trời phủ kín mây xám xịt, ánh sáng ban ngày khuếch tán nhẹ nhàng, đều khắp, không có bóng nắng gắt. Tiền cảnh là đường nhựa xám và vỉa hè bê tông sạch sẽ, với lối xe lên (ramp) lát bê tông ở giữa. Hai bên là hai cây xanh đường phố mới trồng, được chống giữ bằng khung gỗ. Hậu cảnh là một hàng cây xanh rậm rạp giống như bìa rừng. Bên phải lộ ra một phần mặt tiền của ngôi nhà hiện đại lân cận. Không khí yên tĩnh, chân thực." },
  { id: 9, name: "Mẫu 9 - Lối đi nông thôn", content: "Ảnh chụp thực tế ngoại cảnh siêu thực, chất lượng 8K. Bối cảnh là một lối đi bê tông nhỏ dẫn vào khu vườn hoặc nhà ở vùng quê yên bình. Tiền cảnh trên mặt đường bê tông hơi cũ có một con gà mái màu nâu đang dẫn đàn gà con màu vàng nhỏ kiếm ăn. Hai bên lối đi là thảm thực vật nhiệt đới rất rậm rạp, xanh tốt, um tùm cây lá, bao gồm bụi chuối lớn bên trái và các loại cây bụi, cây ăn quả bên phải. Bầu trời nhiều mây xám xịt, âm u, báo hiệu trời sắp mưa hoặc vừa mưa xong. Ánh sáng ban ngày khuếch tán dịu, mềm mại, không có nắng gắt. Không khí ẩm ướt, trong lành, dân dã." },
  { id: 10, name: "Mẫu 10 - Hồ nước nông thôn", content: "Ảnh chụp thực tế phong cảnh nông thôn Việt Nam siêu thực vào giờ vàng (bình minh hoặc hoàng hôn). Bối cảnh là một hồ nước (ao) rộng, mặt nước phẳng lặng như gương ở tiền cảnh, phản chiếu hoàn hảo và rõ nét hình ảnh kiến trúc và cây cối trên bờ đối diện. Bờ bên kia có các ngôi nhà nhỏ kiểu truyền thống mái ngói, tường trắng và hàng rào bao quanh. Nổi bật bên trái là một bụi tre ngà lớn, cùng với các cây cọ và cây xanh rậm rạp. Ánh sáng nắng vàng óng, ấm áp bao trùm toàn bộ không gian, không khí hơi mù sương (hazy), tạo cảm giác tĩnh lặng, thanh bình." },
  { id: 11, name: "Mẫu 11 - Resort cao cấp", content: "Ảnh chụp thực tế ngoại cảnh siêu thực, chất lượng 8K. Bối cảnh là khu vực sân vườn trung tâm của một khu resort hoặc quần thể biệt thự nghỉ dưỡng cao cấp. Đường đi nội bộ lát bê tông phẳng phiu, sạch sẽ. Cảnh quan nhiệt đới phong phú được chăm sóc tỉ mỉ với nhiều loại cây cọ cao vút, cây đại (sứ) hoa trắng, các bụi cây cắt tỉa gọn gàng và thảm thực vật xanh mướt bao quanh hai bên. Thấp thoáng các phần của kiến trúc biệt thự hiện đại màu trắng ở rìa bức ảnh. Thời tiết ban ngày nắng đẹp rực rỡ, bầu trời xanh trong với vài đám mây trắng nhẹ trôi. Ánh nắng mặt trời mạnh tạo bóng đổ sắc nét xuống mặt sân. Không khí sang trọng, yên bình, trong lành." },
  { id: 12, name: "Mẫu 12 - Mặt tiền phố (Eye-level)", content: "Ảnh chụp thực tế ngoại cảnh góc nhìn mắt người (eye-level), chất lượng 8K siêu thực. Bối cảnh là một vị trí mặt tiền đường phố rộng tại một khu đô thị hiện đại. Tiền cảnh là đường nhựa có xe cộ đang di chuyển (bên trái) và một chiếc sedan màu đen đậu bên phải, tiếp đến là vỉa hè lát gạch sạch sẽ với các bụi cây thấp trang trí ngay chân vị trí trung tâm. Hai bên là hàng cây xanh đường phố và các tòa nhà chung cư cao tầng hiện hữu màu trắng/xám sáng ở hậu cảnh phía xa. Thời tiết ban ngày nắng đẹp rực rỡ, bầu trời xanh trong vắt, rất ít mây. Ánh sáng nắng mạnh, rõ nét. Không khí đô thị thoáng đãng, hiện đại." },
  { id: 13, name: "Mẫu 13 - Phố sầm uất", content: "Ảnh chụp thực tế ngoại cảnh góc nhìn ngang tầm mắt (eye-level), siêu thực, chất lượng 8K. Bối cảnh là một mặt tiền đường phố sầm uất điển hình tại Việt Nam vào ban ngày. Tiền cảnh là đường nhựa và vỉa hè lát gạch bê tông. Khung cảnh đường phố sống động với người dân đi bộ trên vỉa hè, xe máy đang di chuyển và ô tô đỗ ven đường. Hai bên là hàng cây xanh đường phố cao lớn, tán lá rậm rạp và các dãy nhà phố mái ngói hiện hữu. Phía trên cao có hệ thống dây điện và cáp viễn thông chăng ngang. Thời tiết nắng ráo, ánh sáng ban ngày rực rỡ, tự nhiên. Không khí đô thị nhộn nhịp, chân thực." },
  { id: 14, name: "Mẫu 14 - Biệt thự đồi (Aerial)", content: "Ảnh chụp thực tế toàn cảnh từ trên cao (aerial view) siêu thực, chất lượng 8K. Bối cảnh là một lô đất biệt thự nằm trên sườn đồi nhìn ra biển. Tiền cảnh là con đường nhựa uốn lượn. Vị trí lô đất được bao quanh bởi tường đá thấp, cổng sắt màu xanh ngọc và các bụi hoa giấy màu hồng rực rỡ. Thảm thực vật xung quanh là cây bụi, cây ô liu và cây thông đặc trưng vùng Địa Trung Hải. Hậu cảnh là tầm nhìn bao quát ra biển xanh thẳm, đường bờ biển với các ngọn đồi phủ cây xanh kéo dài. Thời tiết ban ngày nắng gắt, bầu trời xanh trong không gợn mây. Không khí nghỉ dưỡng sang trọng, thoáng đãng." },
  { id: 15, name: "Mẫu 15 - Biệt thự liền kề", content: "Ảnh chụp thực tế ngoại cảnh siêu thực, góc nhìn ngang tầm mắt, chất lượng 8K. Bối cảnh là một lô đất mặt tiền trên đường nội bộ của một khu đô thị mới hiện đại. Tiền cảnh là đường nhựa đen và vỉa hè lát gạch sạch sẽ. Hai bên là cây xanh đường phố thân thẳng có cọc chống và dải cây bụi thấp xanh mướt chạy dọc theo ranh giới đất. Bên phải có một chiếc xe ô tô sedan màu trắng đang đậu trên vỉa hè. Hậu cảnh là các dãy biệt thự liền kề màu trắng sang trọng, có hàng rào sắt. Phía trên cao có đường dây điện chạy ngang. Thời tiết ban ngày nắng gắt, rực rỡ, bầu trời xanh trong vắt. Bóng nắng đổ sắc nét xuống mặt đường. Không khí sạch sẽ, thoáng đãng." },
];

export const ASPECT_RATIOS = ["1:1", "3:4", "4:3", "9:16", "16:9"];

export const ADMIN_KEY = "TANPHAT";

export const ADMIN_POSITIVE_PARAMS = `
POSITIVE PARAMETERS:
1. Optical Physics: Camera: "Shot on Sony A7R IV", "Canon R5". Lens: "24mm wide angle", "f/8 aperture" (DOF sâu). Focus: "Sharp focus", "Zero chromatic aberration".
2. Material Physics: Textures: "Raw concrete (High-res)", "Natural stone cladding", "Tempered glass with Fresnel reflections". Surface Details: "Imperfections", "Dust particles", "Wet pavement texture".
3. Lighting & Atmosphere: Type: "Global Illumination", "Volumetric lighting (God rays)", "Ray Tracing". Time: "Golden hour", "Soft sunlight". Color Temp: "White balance 5600K".
4. Environmental Context (VIETNAM SPECIFIC): Vegetation: "Lush tropical plants", "Palm trees", "Bougainvillea". Street Elements: "Vietnamese urban context", "Electric wires (subtle)", "Motorbikes in background".
5. Technical Specs: Engine: "Unreal Engine 5", "Octane Render". Resolution: "8K UHD", "Super-resolution". Style: "Archdaily magazine quality", "Modernism", "Indochine luxury".
`;

export const ADMIN_NEGATIVE_CONSTRAINTS = `
B. NEGATIVE CONSTRAINTS (Các yếu tố bị cấm - Trọng số -2.0):
*Cấm tuyệt đối các yếu tố sau:*
1. Artistic Style Violations: NO: Cartoon, anime, painting, drawing, sketch, illustration, oil painting, watercolor, cel-shaded. NO: "3D render style" (tránh cảm giác giả/nhựa).
2. Geometric Hallucinations: NO: Distorted perspective, warped lines, defying gravity, floating objects. NO: Changing the camera angle or adding extra floors/roof design (Geometry MUST be locked).
3. Image Quality Artifacts:
    - NO: Low resolution, blurry, pixelated, jpeg artifacts, grainy noise.
    - NO: Watermarks, text, logos, signatures, frames, borders, any form of writing (chữ viết), unwanted branding, logo TÂN PHÁT (phiên bản vẽ).
4. Unrealistic Attributes:
    - NO: Oversaturated colors, neon lights, psychedelic palettes.
    - NO: Flat lighting (must have shadows).
    - NO: Any generated text or graphic element that resembles the TANPHAT logo.
`;

export const getLogoSvg = (variant: 'original' | 'white') => {
  const textColor1 = "#b91c1c"; // Red
  const textColor2 = variant === 'original' ? "#000000" : "#ffffff";
  const sloganColor = variant === 'original' ? "#333333" : "#e2e8f0"; 
  
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 100" fill="none">
    <defs>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700;900&amp;display=swap');
      </style>
    </defs>
    
    <!-- Text Only - Aligned Left - "TÂN PHÁT TOTE & BUILDING" - NO ICON -->
    <text x="0" y="55" font-family="Roboto, sans-serif" font-weight="900" font-size="42" fill="${textColor1}">TÂN PHÁT</text>
    <text x="215" y="55" font-family="Roboto, sans-serif" font-weight="900" font-size="42" fill="${textColor2}">TOTE &amp; BUILDING</text>
    
    <!-- Slogan -->
    <text x="2" y="85" font-family="Roboto, sans-serif" font-size="14" font-weight="500" fill="${sloganColor}" letter-spacing="1">Luôn luôn đồng hành - luôn luôn chia sẻ</text>
  </svg>
  `;
}
