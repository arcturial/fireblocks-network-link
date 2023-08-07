import * as ErrorFactory from '../http-error-factory';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AssetDefinition, EntityIdPathParam } from '../../client/generated';
import { assetsController } from '../controllers/assets-controller';

export async function getAssetDetails(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<AssetDefinition | void> {
  const { id } = request.params as { id: EntityIdPathParam };
  const asset = assetsController.getAdditionalAsset(id);

  if (!asset) {
    return ErrorFactory.notFound(reply);
  }

  return asset;
}
