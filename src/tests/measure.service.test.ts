import { MeasureController } from "../app/controllers/measure.controller";
import { measureRepository } from "../app/repositories/MeasureRepository";
import { MeasureService } from "../app/services/measure.service";

jest.mock('../app/repositories/MeasureRepository', () => {
  return {
    measureRepository: {
      find: jest.fn(),
    },
  };
});

describe('', () => {
  let controller: MeasureController;
  let service: MeasureService;

  beforeEach(() => {
    controller = new MeasureController();
    service = new MeasureService();
  });

  describe('GET /customerCode/list', () => {
    it('should respond with "error_code: INVALID_TYPE" when given an invalid query parameter', async () => {
      const result = await service.getMeasures('valid59595', 'ELECTRIC');

      expect(result).toEqual({
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida',
      });
    });

    it('should respond with "error_code: MEASURES_NOT_FOUND" when given an invalid customerCode', async () => {
      
      (measureRepository.find as jest.Mock).mockResolvedValueOnce([]);

      const result = await service.getMeasures('invalidNonExistingCustom3rc0d3', 'WATER');

      expect(result).toEqual({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });

      expect(measureRepository.find).toHaveBeenCalled();
    });

    it('should respond with a list of measures when given a valid customerCode without query parameter', async () => {
      
      const mockMeasures = [
        { uuid: '1', measured_datetime: new Date(), measure_type: 'water', has_confirmed: true, image_url: 'http://umaurlqualquer.com' },
      ];

      (measureRepository.find as jest.Mock).mockResolvedValueOnce(mockMeasures);

      const result = await service.getMeasures('cust0m3rc0d31sv4l1d');

      expect(result).toEqual({
      customer_code: 'cust0m3rc0d31sv4l1d',
      measures: mockMeasures,
    });

      expect(measureRepository.find).toHaveBeenCalled();
    });

  });
});
