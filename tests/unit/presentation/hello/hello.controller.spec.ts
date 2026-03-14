import { Test, TestingModule } from '@nestjs/testing';
import { HelloController } from '../../../../src/presentation/hello/hello.controller';

describe('HelloController', () => {
  let controller: HelloController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
    }).compile();

    controller = module.get(HelloController);
  });

  it('getHello returns message', () => {
    const result = controller.getHello();
    expect(result).toEqual({ message: 'Hello World!' });
  });
});
